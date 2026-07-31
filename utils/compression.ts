import * as ImageManipulator from 'expo-image-manipulator';
import { DEFAULT_PHOTO_QUALITY, DEFAULT_PHOTO_MAX_WIDTH } from '../constants';

export interface CompressionOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export async function compressImage(
  uri: string,
  options: CompressionOptions = {}
): Promise<string> {
  const quality = options.quality ?? DEFAULT_PHOTO_QUALITY;
  const maxWidth = options.maxWidth ?? DEFAULT_PHOTO_MAX_WIDTH;
  const maxHeight = options.maxHeight;

  const actions: ImageManipulator.Action[] = [];

  if (maxWidth || maxHeight) {
    actions.push({
      resize: {
        width: maxWidth,
        height: maxHeight,
      },
    });
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: quality / 100,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return result.uri;
}
