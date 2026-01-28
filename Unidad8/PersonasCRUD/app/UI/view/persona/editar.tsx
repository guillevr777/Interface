import { IDepartamento } from '@/app/container/types';
import { Persona } from '@/app/domain/entities/Persona';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CRUDPersonaVM } from '../../viewmodel/PersonasVM';

export default function EditarPersona() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [vm] = useState(() => new CRUDPersonaVM());
  
  const [persona, setPersona] = useState<Persona>(new Persona('', '', '', '', '', new Date().toISOString(), 0));
  const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function inicializar() {
      setLoading(true);
      // 1. Cargamos departamentos para que el Picker tenga opciones
      const listaDeptos = await vm.cargarDepartamentos();
      setDepartamentos(listaDeptos);

      // 2. Si es edición, cargamos los datos actuales
      if (params.id) {
        setModoEdicion(true);
        const p = await vm.obtener(Number(params.id));
        if (p) setPersona(p);
      }
      setLoading(false);
    }
    inicializar();
  }, [params.id]);

  const handleGuardar = async () => {
    // Verificación simple antes de enviar
    if (!persona.Nombre || !persona.IDDepartamento) {
      Alert.alert("Error", "El nombre y el departamento son obligatorios");
      return;
    }
    
    const success = modoEdicion ? await vm.actualizar(persona) : await vm.crear(persona);
    if (success) {
      router.back();
    } else {
      Alert.alert("Error 400", "Revisa la consola para ver el error del servidor");
    }
  };

  if (loading) return <View style={s.centered}><ActivityIndicator size="large" color="#007AFF" /></View>;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.title}>{modoEdicion ? '📝 Editar Persona' : '👤 Nueva Persona'}</Text>
      
      <View style={s.form}>
        <Text style={s.label}>Nombre</Text>
        <TextInput style={s.input} value={persona.Nombre} onChangeText={t => setPersona({ ...persona, Nombre: t })} />

        <Text style={s.label}>Apellidos</Text>
        <TextInput style={s.input} value={persona.Apellidos} onChangeText={t => setPersona({ ...persona, Apellidos: t })} />

        <Text style={s.label}>Teléfono</Text>
        <TextInput style={s.input} keyboardType="phone-pad" value={persona.Telefono} onChangeText={t => setPersona({ ...persona, Telefono: t })} />

        <Text style={s.label}>Calle / Dirección</Text>
        <TextInput 
          style={s.input} 
          value={persona.Direccion} 
          onChangeText={t => setPersona({ ...persona, Direccion: t })} 
          placeholder="Introduce la dirección"
        />

        <Text style={s.label}>Departamento</Text>
        <View style={s.pickerWrapper}>
          <Picker
            selectedValue={persona.IDDepartamento}
            onValueChange={(itemValue) => setPersona({ ...persona, IDDepartamento: itemValue })}
          >
            <Picker.Item label="Seleccione un departamento..." value={0} />
            {departamentos.map((depto) => (
              <Picker.Item key={depto.id} label={depto.nombre} value={depto.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={s.saveBtn} onPress={handleGuardar}>
          <Text style={s.saveBtnText}>{modoEdicion ? 'Guardar Cambios' : 'Registrar Persona'}</Text>
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
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20, backgroundColor: '#fafafa', overflow: 'hidden' },
  saveBtn: { backgroundColor: '#34C759', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});