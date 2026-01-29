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
  
  // Instancia del ViewModel
  const [vm] = useState(() => new CRUDPersonaVM());
  
  // Objeto inicial
  const personaVacia = new Persona('', '', '', '', '', new Date().toISOString(), 0);

  // Estados
  const [persona, setPersona] = useState<Persona>(personaVacia);
  const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function inicializar() {
      setLoading(true);
      
      // 1. Cargamos los departamentos
      const listaDeptos = await vm.cargarDepartamentos();
      if (isMounted) setDepartamentos(listaDeptos);

      // 2. Comprobamos si es Edición o Creación
      if (params.id) {
        const p = await vm.obtener(Number(params.id));
        if (isMounted && p) {
          setPersona(p);
          setModoEdicion(true);
        }
      } else {
        setPersona(personaVacia);
        setModoEdicion(false);
      }
      
      if (isMounted) setLoading(false);
    }

    inicializar();
    return () => { isMounted = false; };
  }, [params.id]);

  const handleGuardar = async () => {
    // Validación básica
    if (!persona.Nombre?.trim() || !persona.FechaNacimiento || persona.IDDepartamento === 0) {
      Alert.alert("Validación", "Nombre, Fecha de Nacimiento y Departamento son obligatorios");
      return;
    }

    const success = modoEdicion 
      ? await vm.actualizar(persona) 
      : await vm.crear(persona);

    if (success) {
      Alert.alert("Éxito", modoEdicion ? "Persona actualizada" : "Persona creada");
      router.replace('/UI/view/persona');
    } else {
      Alert.alert("Error", vm.error || "No se pudo completar la operación");
    }
  };

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.title}>{modoEdicion ? '📝 Editar Persona' : '👤 Nueva Persona'}</Text>
      
      <View style={s.form}>
        <Text style={s.label}>Nombre</Text>
        <TextInput 
          style={s.input} 
          value={persona.Nombre} 
          onChangeText={t => setPersona({ ...persona, Nombre: t })} 
          placeholder="Nombre"
        />

        <Text style={s.label}>Apellidos</Text>
        <TextInput 
          style={s.input} 
          value={persona.Apellidos} 
          onChangeText={t => setPersona({ ...persona, Apellidos: t })} 
          placeholder="Apellidos"
        />

        {/* NUEVO CAMPO: FECHA DE NACIMIENTO */}
        <Text style={s.label}>Fecha de Nacimiento (AAAA-MM-DD)</Text>
        <TextInput 
          style={s.input} 
          value={persona.FechaNacimiento.split('T')[0]} 
          onChangeText={t => setPersona({ ...persona, FechaNacimiento: t })} 
          placeholder="Ejemplo: 1990-05-15"
          keyboardType="numeric"
        />

        <Text style={s.label}>Teléfono</Text>
        <TextInput 
          style={s.input} 
          keyboardType="phone-pad" 
          value={persona.Telefono} 
          onChangeText={t => setPersona({ ...persona, Telefono: t })} 
        />

        <Text style={s.label}>Dirección</Text>
        <TextInput 
          style={s.input} 
          value={persona.Direccion} 
          onChangeText={t => setPersona({ ...persona, Direccion: t })} 
        />

        <Text style={s.label}>Departamento</Text>
        <View style={s.pickerWrapper}>
          <Picker
            selectedValue={persona.IDDepartamento}
            onValueChange={(val) => setPersona({ ...persona, IDDepartamento: val })}
          >
            <Picker.Item label="Seleccione un departamento..." value={0} />
            {departamentos.map((depto) => (
              <Picker.Item key={depto.id} label={depto.nombre} value={depto.id} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={[s.saveBtn, { backgroundColor: modoEdicion ? '#007AFF' : '#34C759' }]} 
          onPress={handleGuardar}
        >
          <Text style={s.saveBtnText}>
            {modoEdicion ? 'Guardar Cambios' : 'Registrar Persona'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={s.cancelBtn} 
          onPress={() => router.back()}
        >
          <Text style={s.cancelBtnText}>Cancelar</Text>
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
  saveBtn: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { marginTop: 15, alignItems: 'center' },
  cancelBtnText: { color: '#666', fontSize: 14 }
});