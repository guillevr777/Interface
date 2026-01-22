import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CRUDPersonaVM } from '../../viewmodel/PersonasVM';

export default function ListadoPersonas() {
  const router = useRouter();
  const [vm] = useState(() => new CRUDPersonaVM());
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(v => v + 1);

  useEffect(() => { 
    vm.listar().then(refresh); 
  }, []);

  if (vm.loading) {
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
        // ✅ Ruta corregida
        onPress={() => router.push('../persona/editar')}
      >
        <Text style={s.addBtnText}>+ Nueva Persona</Text>
      </TouchableOpacity>

      {vm.error && <Text style={s.error}>{vm.error}</Text>}

      <FlatList
        data={vm.personas}
        keyExtractor={item => item.ID!.toString()}
        renderItem={({ item }) => (
          <View style={s.item}>
            <Text style={s.itemText}>{item.Nombre} {item.Apellidos}</Text>
            <View style={s.actions}>
              <TouchableOpacity 
                style={s.editBtn}
                onPress={() => router.push({
                  pathname: '../persona/editar',
                  params: { id: item.ID }
                })}
              >
                <Text style={s.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={s.delBtn}
                onPress={async () => {
                  if (await vm.eliminar(item.ID!)) {
                    refresh();
                  } else {
                    alert(vm.error || 'Error al eliminar');
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
  addBtn: { backgroundColor: '#34C759', padding: 14, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  item: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12 },
  itemText: { fontSize: 16, marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#007AFF', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  delBtn: { backgroundColor: '#FF3B30', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});