import { Departamento } from '@/app/domain/entities/Departamento';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CRUDDepartamentoVM } from '../../viewmodel/DepartamentosVM';

export default function EditarDepartamento() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [vm] = useState(() => new CRUDDepartamentoVM());
  
  const idKey = params.id ? String(params.id) : 'nuevo';

  const [departamento, setDepartamento] = useState<Departamento>(new Departamento(0, ''));
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function cargar() {
      setLoading(true);
      if (params.id) {
        const d = await vm.obtener(Number(params.id));
        if (isMounted && d) {
          setDepartamento(d);
          setModoEdicion(true);
        }
      } else {
        setDepartamento(new Departamento(0, ''));
        setModoEdicion(false);
      }
      if (isMounted) setLoading(false);
    }

    cargar();
    return () => { isMounted = false; };
  }, [idKey]);

  const handleGuardar = async () => {
    if (!departamento.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    const success = modoEdicion 
      ? await vm.actualizar(departamento) 
      : await vm.crear(departamento);

    if (success) {
      router.replace('/UI/view/departamento');
    } else {
      Alert.alert("Error", "No se pudo guardar el departamento");
    }
  };

  if (loading) return <View style={s.centered}><ActivityIndicator size="large" color="#007AFF" /></View>;

  return (
    <ScrollView style={s.container} key={idKey}>
      <Text style={s.title}>{modoEdicion ? '📝 Editar Departamento' : '🏢 Nuevo Departamento'}</Text>
      
      <View style={s.form}>
        <Text style={s.label}>Nombre del Departamento</Text>
        <TextInput 
          style={s.input} 
          value={departamento.nombre} 
          onChangeText={t => setDepartamento({ ...departamento, nombre: t })} 
          placeholder="Ej: Recursos Humanos"
        />

        <TouchableOpacity 
          style={[s.saveBtn, { backgroundColor: modoEdicion ? '#007AFF' : '#34C759' }]} 
          onPress={handleGuardar}
        >
          <Text style={s.saveBtnText}>
            {modoEdicion ? 'Guardar Cambios' : 'Crear Departamento'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#fafafa' },
  saveBtn: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});