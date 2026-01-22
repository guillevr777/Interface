import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
      <Drawer.Screen name="persona/index" options={{ title: 'Personas' }} />
      <Drawer.Screen name="departamento/index" options={{ title: 'Departamentos' }} />
      <Drawer.Screen 
        name="persona/editar" 
        options={{ 
          title: 'Editar Persona',
          drawerItemStyle: { display: 'none' } // Ocultar del menú
        }} 
      />
      <Drawer.Screen 
        name="departamento/editar" 
        options={{ 
          title: 'Editar Departamento',
          drawerItemStyle: { display: 'none' }
        }} 
      />
    </Drawer>
  );
}