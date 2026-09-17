# Firestore Security Rules Audit (Issue #34)

Date: 2026-09-17. Audited commit: `origin/develop` (rules file is identical on `main` and `develop`).

## Verdict

**Per-user data IS isolated.** An authenticated user A cannot read, write, or list user B's sessions, songs, or resources. Verified both by static reading of the rules and by executing 22 checks against the Firestore emulator with `@firebase/rules-unit-testing` (all behaved as the rules dictate). One real gap exists: **any signed-in user can write to the `carousels` collection**, which the app treats as read-only shared content.

## Which rules file is live

- `firebase.json:50` points `firestore.rules` (repo root) as the deployed ruleset.
- `firestore.rules` (root, 40 lines) is the effective file.
- `src/app/storage/firestore.rules` is a **stale duplicate** — a stricter, older draft (per-collection rules with `ownerUid` stamping and type validation, lines 17–35). It is NOT referenced by `firebase.json` and is dead weight; it can mislead readers into thinking field-level validation is enforced. Same for `src/app/storage/storage.rules`.

## Rules coverage vs. collections the app actually uses

Collection paths used by the app (from `src/app/services/*` and `src/app/features/dashboard/dashboard.resolver.ts`):

| Path | Used in | Rule | Result |
|---|---|---|---|
| `users/{uid}/sessions/*` | `session.service.ts:36,68,82,98,105`, `dashboard.resolver.ts:38` | `firestore.rules:7-9` (owner-only read/write) | ✅ isolated |
| `users/{uid}/songs/*` | `songs.service.ts:31,44,51,70,77`, `dashboard.resolver.ts:94` | `firestore.rules:7-9` | ✅ isolated |
| `users/{uid}/resources/*` | `resource.service.ts:37,101,115,144,153,159` | `firestore.rules:7-9` | ✅ isolated |
| `users/{uid}/sessions/{id}/resources/*` | `resource.service.ts:45,70` | `firestore.rules:7-9` (`{coll=**}` recursive wildcard covers nested subcollections) | ✅ isolated |
| `carousels/{slug}/items/*` | `carousel.service.ts:29-32,45-48` | `firestore.rules:17-25` | ⚠️ world-readable (intended), **writable by ANY signed-in user** (gap) |
| `popularArtists`, `popularAlbums`, `popularSongs` | `popular-music.service.ts:20,35,50` | `firestore.rules:28-38` (auth'd read only, no client write) | ✅ read-only |
| `theory/{topicId}` | (rule exists; no app read found in services) | `firestore.rules:12-15` (public read, admin-claim write) | ✅ |

No app-used collection is missing from the rules. Unmatched paths default-deny (verified: write to `randomColl/x` denied).

Note: `users/{uid}` **root document** is NOT covered — the `{coll=**}/{docId}` pattern requires at least one subcollection segment, so reads/writes to `users/alice` itself are denied for everyone including the owner (emulator-verified: "No matching allow statements"). The app doesn't currently read/write the root user doc, so this is a latent limitation, not a live bug.

## Emulator verification (22 checks)

Ran `firebase emulators:exec --only firestore` with the root `firestore.rules` and `@firebase/rules-unit-testing`. Key results:

Denied (as expected):
- alice read/write/list bob's `sessions`, `songs`, `resources` — all `PERMISSION_DENIED`
- anonymous read of bob's session — denied
- anonymous / non-admin write to `theory` — denied
- signed-in write to `popularArtists` — denied
- write to unmatched collection — denied

Allowed (as expected):
- bob read/write his own session/resource
- anonymous read of `theory` and `carousels/*/items`
- signed-in read of `popularArtists`

Flagged:
- **alice (arbitrary signed-in user) successfully wrote `carousels/dash/items/i9` and created `carousels/evil`** — `firestore.rules:19` and `firestore.rules:23` are `allow write: if request.auth != null;`. Any authenticated user can deface, reorder (`position` field), delete, or inject carousel content shown to all users (`carousel.service.ts` renders these on the dashboard). No admin check, unlike `theory` (`firestore.rules:14`).

## Rules unit tests: none exist

- No usage of `@firebase/rules-unit-testing` anywhere in the repo (grep over the whole tree: 0 hits; not in `package.json`).
- `session.service.spec.ts` / `songs.service.spec.ts` mock `collection()`/`doc()` — they test service logic, **not** security rules. The belief that unit tests cover per-user isolation is incorrect; isolation is enforced solely by the rules file with no automated regression test.

## Deployed rules can drift from the repo

- **No CI step deploys Firestore rules.** `.github/workflows/deploy.yml` and `firebase-hosting-merge.yml`/`-pull-request.yml` use `FirebaseExtended/action-hosting-deploy`, which deploys **hosting only**. Rules reach production only via manual `firebase deploy` (or console edits), so the live ruleset in project `guitar-journey-b3295` is not guaranteed to match `firestore.rules` at HEAD. This audit verified the **repo copy** only; confirming the deployed copy requires `firebase firestore:rules:get` / console inspection.
- `storage.rules` (root, deployed per `firebase.json:103`) is `allow read, write: if false;` — Storage fully locked down.

## Gaps summary (not fixed — research only)

1. `carousels/**` writable by any authenticated user (`firestore.rules:19,23`) — should be admin-gated like `theory`.
2. No rules unit tests exist; isolation has no automated regression coverage.
3. No CI deploy of rules → repo/production drift possible; deployed ruleset unverified.
4. Stale duplicate rules files in `src/app/storage/` (`firestore.rules`, `storage.rules`) not referenced by `firebase.json` — confusing dead code.
5. Latent: `users/{uid}` root doc unreachable by owner (no rule matches a bare user doc).
