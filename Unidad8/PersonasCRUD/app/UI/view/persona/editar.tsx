import { Persona } from '@/app/domain/entities/Persona';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CRUDPersonaVM } from '../../viewmodel/PersonasVM';

export default function EditarPersona() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [vm] = useState(() => new CRUDPersonaVM());
  
  // Inicializamos con valores vacíos para evitar errores de "null" en los inputs
  const [persona, setPersona] = useState<Persona>(new Persona('', '', '', '', '', new Date().toISOString(), 0));
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (params.id) {
      setModoEdicion(true);
      vm.obtener(Number(params.id)).then(p => {
        if (p) setPersona(p);
      });
    }
  }, [params.id]);

  const handleGuardar = async () => {
    try {
      // 1. Construimos el objeto base con datos limpios
      const datosPersona: any = {
        Nombre: persona.Nombre || '',
        Apellidos: persona.Apellidos || '',
        Telefono: persona.Telefono || '',
        Direccion: persona.Direccion || '',
        FotoURL: persona.FotoURL || '',
        FechaNacimiento: persona.FechaNacimiento || new Date().toISOString(),
        IDDepartamento: Number(persona.IDDepartamento) || 0,
      };

      // 2. Lógica crucial: Solo incluimos el ID si estamos EDITANDO
      if (modoEdicion) {
        datosPersona.ID = Number(params.id);
      }

      console.log("Datos enviados al servidor:", datosPersona);

      const success = modoEdicion 
        ? await vm.actualizar(datosPersona) 
        : await vm.crear(datosPersona);

      if (success) {
        router.back();
      } else {
        Alert.alert("Error", vm.error || "El servidor rechazó la solicitud.");
      }
    } catch (err) {
      Alert.alert("Error de Red", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.title}>{modoEdicion ? '📝 Editar Persona' : '👤 Nueva Persona'}</Text>
      
      <View style={s.form}>
        <Text style={s.label}>Nombre</Text>
        <TextInput 
          style={s.input} 
          value={persona.Nombre || ''} 
          onChangeText={t => setPersona({ ...persona, Nombre: t })} 
        />

        <Text style={s.label}>Apellidos</Text>
        <TextInput 
          style={s.input} 
          value={persona.Apellidos || ''} 
          onChangeText={t => setPersona({ ...persona, Apellidos: t })} 
        />

        <Text style={s.label}>Teléfono</Text>
        <TextInput 
          style={s.input} 
          keyboardType="phone-pad"
          value={persona.Telefono || ''} 
          onChangeText={t => setPersona({ ...persona, Telefono: t })} 
        />

        <Text style={s.label}>Dirección</Text>
        <TextInput 
          style={s.input} 
          value={persona.Direccion || ''} 
          onChangeText={t => setPersona({ ...persona, Direccion: t })} 
        />

        <Text style={s.label}>ID Departamento</Text>
        <TextInput 
          style={s.input} 
          keyboardType="numeric"
          value={String(persona.IDDepartamento || '')} 
          onChangeText={t => setPersona({ ...persona, IDDepartamento: parseInt(t) || 0 })} 
        />

        <TouchableOpacity style={s.saveBtn} onPress={handleGuardar}>
          <Text style={s.saveBtnText}>
            {modoEdicion ? 'Guardar Cambios' : 'Registrar Persona'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#fafafa' },
  saveBtn: { backgroundColor: '#34C759', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});