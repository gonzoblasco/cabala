import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { STORAGE_DIRS } from '../constants';

let recording: Audio.Recording | null = null;

export async function startRecording(): Promise<void> {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permiso de micrófono no concedido');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording: newRecording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  recording = newRecording;
}

export async function stopRecording(): Promise<string> {
  if (!recording) {
    throw new Error('No hay grabación activa');
  }

  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();

  if (!uri) {
    throw new Error('No se pudo obtener la URI de la grabación');
  }

  // Move to app storage
  const audioDir = `${FileSystem.documentDirectory}${STORAGE_DIRS.audio}`;
  await FileSystem.makeDirectoryAsync(audioDir, { intermediates: true });

  const filename = `voice_${Date.now()}.m4a`;
  const dest = `${audioDir}/${filename}`;
  await FileSystem.moveAsync({ from: uri, to: dest });

  recording = null;

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });

  return dest;
}

export async function cancelRecording(): Promise<void> {
  if (recording) {
    await recording.stopAndUnloadAsync();
    recording = null;
  }
}

export async function playAudio(uri: string): Promise<void> {
  const { sound } = await Audio.Sound.createAsync(
    { uri },
    { shouldPlay: true }
  );
  await sound.playAsync();
}

export async function deleteAudio(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // File might not exist
  }
}
