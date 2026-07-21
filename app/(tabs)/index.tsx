import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEntries } from '../../hooks/useEntries';
import { EntryCard } from '../../components/EntryCard';

export default function TimelineScreen() {
  const router = useRouter();
  const { entries, loading } = useEntries();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cábala</Text>
        <Text style={styles.subtitle}>Tus momentos</Text>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            onPress={() => router.push(`/entry/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyText}>Todavía no hay fotos</Text>
            <Text style={styles.emptySubtext}>
              Tocá el botón + para tomar tu primera foto
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/entry/new')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5F5F5',
  },
  subtitle: {
    fontSize: 14,
    color: '#A3A3A3',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#F5F5F5',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A3A3A3',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    fontSize: 28,
    color: '#F5F5F5',
    fontWeight: '300',
    marginTop: -2,
  },
});
