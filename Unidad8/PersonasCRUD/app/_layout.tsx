// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: 'Inicio' }} />
      
      {/* EXPO ROUTER busca el archivo en app/UI/view/persona/index.tsx */}
      <Drawer.Screen 
        name="UI/view/persona/index" 
        options={{ title: 'Personas' }} 
      />
      
      <Drawer.Screen 
        name="UI/view/departamento/index" 
        options={{ title: 'Departamentos' }} 
      />

      {/* Para las de editar que están en la misma carpeta */}
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