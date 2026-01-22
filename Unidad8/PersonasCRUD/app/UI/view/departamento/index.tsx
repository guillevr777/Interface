import { Departamento } from '@/app/domain/entities/Departamento';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CRUDDepartamentoVM } from '../../viewmodel/DepartamentosVM';

export default function ListadoDepartamentos() {
  const router = useRouter();
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [vm] = useState(() => new CRUDDepartamentoVM());

  const cargar = async () => setDepartamentos(await vm.listar());

  useEffect(() => { cargar(); }, []);

  return (
    <View style={s.container}>
      <Text style={s.title}>Listado de Departamentos</Text>
      <TouchableOpacity 
        style={s.addBtn} 
        onPress={() => router.push('../departamento/editar')}
      >
        <Text style={s.addBtnText}>+ Nuevo Departamento</Text>
      </TouchableOpacity>

      <FlatList
        data={departamentos}
        keyExtractor={d => d.id.toString()}
        renderItem={({ item }) => (
          <View style={s.item}>
            <Text style={s.itemTitle}>{item.nombre}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                onPress={() => router.push({ 
                  pathname: '../departamento/editar', 
                  params: { id: item.id } 
                })} 
                style={s.editBtn}
              >
                <Text style={s.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={async () => { 
                  try {
                    await vm.eliminar(item.id); 
                    cargar();
                  } catch (error: any) {
                    alert(error.message);
                  }
                }} 
                style={s.delBtn}
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  addBtn: { backgroundColor: '#34C759', padding: 14, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '600' },
  item: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  editBtn: { backgroundColor: '#007AFF', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  delBtn: { backgroundColor: '#FF3B30', padding: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});