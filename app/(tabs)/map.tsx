import { View, Text, StyleSheet } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa</Text>
      <Text style={styles.placeholder}>Vista mapa — próximamente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5F5F5',
  },
  placeholder: {
    fontSize: 14,
    color: '#A3A3A3',
    marginTop: 16,
  },
});
