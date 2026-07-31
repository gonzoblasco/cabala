import * as FileSystem from 'expo-file-system';
import { compressImage } from '../utils/compression';
import { STORAGE_DIRS } from '../constants';

export interface SavedPhoto {
  uri: string;
  width: number;
  height: number;
}

export async function savePhoto(
  uri: string,
  options?: { quality?: number; maxWidth?: number }
): Promise<SavedPhoto> {
  const photoDir = `${FileSystem.documentDirectory}${STORAGE_DIRS.photos}`;
  await FileSystem.makeDirectoryAsync(photoDir, { intermediates: true });

  const compressedUri = await compressImage(uri, options);

  const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
  const dest = `${photoDir}/${filename}`;

  await FileSystem.moveAsync({ from: compressedUri, to: dest });

  const info = await FileSystem.getInfoAsync(dest, { size: false });

  return {
    uri: dest,
    width: options?.maxWidth ?? 1080,
    height: 0, // We don't have exact height without loading the image
  };
}

export async function deletePhoto(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // File might not exist, that's fine
  }
}

export function getPhotoFilename(uri: string): string {
  return uri.split('/').pop() ?? 'unknown';
}
