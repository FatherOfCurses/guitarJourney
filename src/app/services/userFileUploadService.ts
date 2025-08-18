import { ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

async function uploadUserFile(storage: Storage, uid: string, file: File) {
  const r = ref(storage, `users/${uid}/uploads/${Date.now()}_${file.name}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}
