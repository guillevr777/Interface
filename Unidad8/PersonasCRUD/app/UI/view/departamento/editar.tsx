import { Departamento } from '@/app/domain/entities/Departamento';
import { useLocalSearchParams, useRouter } from 'expo-router'; // ✅ Cambio aquí
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { CRUDDepartamentoVM } from '../../viewmodel/DepartamentosVM';

export default function EditarDepartamento() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ Cambio aquí
  const [vm] = useState(() => new CRUDDepartamentoVM());
  const [departamento, setDepartamento] = useState<Departamento>(new Departamento());
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (params.id) {
      setModoEdicion(true);
      vm.obtener(Number(params.id)).then(d => d && setDepartamento(d));
    }
  }, [params.id]);

  const handleGuardar = async () => {
    const success = modoEdicion ? await vm.actualizar(departamento) : await vm.crear(departamento);
    if (success) router.back();
    else alert('Error al guardar');
  };

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>{modoEdicion ? 'Editar Departamento' : 'Nuevo Departamento'}</Text>
      <TextInput style={s.input} placeholder="Nombre" value={departamento.nombre} onChangeText={t => setDepartamento({ ...departamento, nombre: t })} />
      <TouchableOpacity style={s.saveBtn} onPress={handleGuardar}>
        <Text style={s.saveBtnText}>{modoEdicion ? 'Guardar Cambios' : 'Crear Departamento'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  saveBtn: { backgroundColor: '#34C759', padding: 16, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});