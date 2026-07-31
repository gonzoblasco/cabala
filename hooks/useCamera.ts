import { useState, useRef, useCallback } from 'react';
import { CameraView } from 'expo-camera';

export function useCamera() {
  const cameraRef = useRef<CameraView>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const takePhoto = useCallback(async (): Promise<string | null> => {
    if (!cameraRef.current || isTakingPhoto) return null;

    setIsTakingPhoto(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1, // Full quality, we compress later
        base64: false,
        exif: false,
      });

      return photo?.uri ?? null;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    } finally {
      setIsTakingPhoto(false);
    }
  }, [isTakingPhoto]);

  return {
    cameraRef,
    takePhoto,
    isTakingPhoto,
  };
}
