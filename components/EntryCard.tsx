import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { Entry } from '../db/queries';

interface EntryCardProps {
  entry: Entry;
  onPress: () => void;
}

export function EntryCard({ entry, onPress }: EntryCardProps) {
  const date = new Date(entry.created_at);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relativeTime: string;
  if (diffHours < 1) {
    relativeTime = 'Ahora';
  } else if (diffHours < 24) {
    relativeTime = `Hace ${diffHours}h`;
  } else if (diffDays === 1) {
    relativeTime = 'Ayer';
  } else if (diffDays < 7) {
    relativeTime = `Hace ${diffDays}d`;
  } else {
    relativeTime = date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
    });
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: entry.photo_path }}
        style={styles.photo}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {entry.title || 'Sin título'}
        </Text>
        {entry.tags && entry.tags.length > 0 && (
          <View style={styles.tags}>
            {entry.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.meta}>
          <Text style={styles.time}>{relativeTime}</Text>
          {entry.audio_path && <Text style={styles.audio}>🎤</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  photo: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F5F5',
    marginBottom: 6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#262626',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    color: '#4ECDC4',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  audio: {
    fontSize: 12,
  },
});
