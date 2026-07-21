import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0D0D0D' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="entry/new"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="entry/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}
