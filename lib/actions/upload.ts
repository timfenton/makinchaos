'use server';

import { put } from '@vercel/blob';

async function uploadFileToBlob(file: File): Promise<string> {
  const blobObj = await put(file.name, file, { access: 'public' });
  return blobObj.url;
}

export async function uploadFiles(files: File[] | File): Promise<string[] | string> {
  if (Array.isArray(files)) {
    // Upload multiple files
    return await Promise.all(files.map(uploadFileToBlob));
  } else {
    // Upload a single file and return as an array for consistency
    const url = await uploadFileToBlob(files);
    return url;
  }
}
