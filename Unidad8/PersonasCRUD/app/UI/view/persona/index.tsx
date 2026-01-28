import { Persona } from '@/app/domain/entities/Persona';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CRUDPersonaVM } from '../../viewmodel/PersonasVM';

export default function ListadoPersonas() {
  const router = useRouter();
  const [vm] = useState(() => new CRUDPersonaVM());
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  // Se ejecuta cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setLoading(true);

      vm.listar().then((data) => {
        if (isMounted) {
          setPersonas(data);
          setLoading(false);
        }
      });

      return () => { isMounted = false; };
    }, [vm])
  );

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <TouchableOpacity
        style={s.addBtn}
        onPress={() => router.push('/UI/view/persona/editar')}
      >
        <Text style={s.addBtnText}>+ Nueva Persona</Text>
      </TouchableOpacity>

      <FlatList
        data={personas}
        keyExtractor={item => item.ID?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={s.item}>
            <View style={s.infoContainer}>
              <Text style={s.itemName}>{item.Nombre} {item.Apellidos}</Text>
              <Text style={s.itemDetail}>📞 {item.Telefono || 'Sin tel.'}</Text>
              <Text style={s.itemDetail}>📍 {item.Direccion || 'Sin direc.'}</Text>
            </View>
            <View style={s.actions}>
              <TouchableOpacity 
                style={s.editBtn}
                onPress={() => router.push({
                  pathname: '/UI/view/persona/editar',
                  params: { id: item.ID }
                })}
              >
                <Text style={s.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={s.delBtn}
                onPress={async () => {
                  if (await vm.eliminar(item.ID!)) {
                    const data = await vm.listar();
                    setPersonas(data);
                  }
                }}
              >
                <Text style={s.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtn: { backgroundColor: '#34C759', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  item: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  infoContainer: { marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemDetail: { fontSize: 14, color: '#666' },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  delBtn: { backgroundColor: '#FF3B30', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});