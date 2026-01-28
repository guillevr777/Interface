// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
      
      <Drawer.Screen 
        name="UI/view/persona/index" 
        options={{ title: 'Personas' }} 
      />
      
      <Drawer.Screen 
        name="UI/view/departamento/index" 
        options={{ title: 'Departamentos' }} 
      />

      {/* --- ESTO OCULTA LO QUE NO QUIERES QUE SALGA --- */}
      <Drawer.Screen 
        name="container/core" 
        options={{ drawerItemStyle: { display: 'none' } }} 
      />
      <Drawer.Screen 
        name="data/database/connection" 
        options={{ drawerItemStyle: { display: 'none' } }} 
      />

      {/* Ocultar también las pantallas de editar para que no ensucien el menú */}
      <Drawer.Screen 
        name="UI/view/persona/editar" 
        options={{ drawerItemStyle: { display: 'none' } }} 
      />
      <Drawer.Screen 
        name="UI/view/departamento/editar" 
        options={{ drawerItemStyle: { display: 'none' } }} 
      />
    </Drawer>
  );
}