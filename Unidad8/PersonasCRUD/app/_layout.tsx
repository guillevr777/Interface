import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'CRUD App' }} />
      <Stack.Screen name="personas" options={{ title: 'Gestión de Personas' }} />
      <Stack.Screen name="departamentos" options={{ title: 'Gestión de Departamentos' }} />
    </Stack>
  );
}