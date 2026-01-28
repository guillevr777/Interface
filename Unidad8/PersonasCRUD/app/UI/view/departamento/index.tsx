import { Departamento } from '@/app/domain/entities/Departamento';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        <Text style={styles.btnTextWhite}>+ Nuevo Departamento</Text>
      </TouchableOpacity>

      <FlatList
        data={departamentos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.nombre}</Text>
              <Text style={styles.cardSub}>ID: {item.id}</Text>
            </View>
            <View style={styles.row}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.editColor]} 
                onPress={() => router.push({ pathname: '/UI/view/departamento/editar', params: { id: item.id } })}
              >
                <Text style={styles.btnTextWhite}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.delColor]} 
                onPress={async () => {
                  try {
                    await vm.eliminar(item.id);
                    setDepartamentos(await vm.listar());
                  } catch (e: any) { Alert.alert("Error", e.message); }
                }}
              >
                <Text style={styles.btnTextWhite}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtn: { backgroundColor: '#FF9500', padding: 15, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSub: { fontSize: 12, color: '#888' },
  row: { flexDirection: 'row', gap: 10, marginTop: 15 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  editColor: { backgroundColor: '#007AFF' },
  delColor: { backgroundColor: '#FF3B30' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold' }
});