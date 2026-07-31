import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { COLORS } from '../constants';

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string) => void;
  existingUri?: string;
  onDelete?: () => void;
}

export function VoiceRecorder({
  onRecordingComplete,
  existingUri,
  onDelete,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (uri) {
        onRecordingComplete(uri);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  async function playExisting() {
    if (!existingUri || isPlaying) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: existingUri },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (existingUri) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={playExisting}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏹' : '▶️'}</Text>
          <Text style={styles.playText}>
            {isPlaying ? 'Reproduciendo...' : 'Escuchar nota'}
          </Text>
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recording]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <View style={[styles.recordIcon, isRecording && styles.recordingIcon]} />
      </TouchableOpacity>
      {isRecording && (
        <Text style={styles.duration}>{formatDuration(recordingDuration)}</Text>
      )}
      <Text style={styles.hint}>
        {isRecording ? 'Tocá para detener' : 'Tocá para grabar'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  recordButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: {
    backgroundColor: COLORS.error,
  },
  recordIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.error,
  },
  recordingIcon: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: COLORS.textPrimary,
  },
  duration: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  playIcon: {
    fontSize: 16,
  },
  playText: {
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  deleteText: {
    color: COLORS.error,
    fontSize: 13,
  },
});
