import { Departamento } from '@/app/domain/entities/Departamento';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CRUDDepartamentoVM } from '../../viewmodel/DepartamentosVM';

export default function ListadoDepartamentos() {
  const router = useRouter();
  const [vm] = useState(() => new CRUDDepartamentoVM());
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const cargar = async () => {
        try {
          setLoading(true);
          const data = await vm.listar();
          if (isMounted) setDepartamentos(data);
        } catch (e) {
          console.error(e);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      cargar();
      return () => { isMounted = false; };
    }, [vm])
  );

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#FF9500" /></View>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/UI/view/departamento/editar')}>
        <Text style={styles.addBtnText}>+ Nuevo Departamento</Text>
      </TouchableOpacity>

      <FlatList
        data={departamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardSub}>ID: {item.id}</Text>
            </View>
            
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.smallBtn, styles.editColor]} 
                onPress={() => router.push({ pathname: '/UI/view/departamento/editar', params: { id: item.id } })}
              >
                <Text style={styles.smallBtnText}>Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.smallBtn, styles.delColor]} 
                onPress={async () => {
                  // Eliminamos la alerta compleja y llamamos directo como en personas
                  const ok = await vm.eliminar(item.id);
                  if (ok) {
                    const data = await vm.listar();
                    setDepartamentos(data);
                  }
                }}
              >
                <Text style={styles.smallBtnText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtn: { backgroundColor: '#FF9500', padding: 12, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 2
  },
  info: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSub: { fontSize: 11, color: '#999' },
  actions: { flexDirection: 'row', gap: 6 },
  smallBtn: { 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 6, 
    minWidth: 60, 
    alignItems: 'center' 
  },
  smallBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  editColor: { backgroundColor: '#007AFF' },
  delColor: { backgroundColor: '#FF3B30' },
});