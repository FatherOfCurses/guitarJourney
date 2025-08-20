"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardResolver = void 0;
const dashboardResolver = async () => {
    // TODO: call real APIs. For now, mocked:
    return {
        lastSession: { id: 'abc123', startedAt: new Date().toISOString(), durationMs: 32 * 60_000 },
        totals: { minutes: 1240, sessionCount: 58, streakDays: 5 },
        recentMinutes: [20, 35, 0, 40, 15, 30, 25],
    };
};
exports.dashboardResolver = dashboardResolver;
