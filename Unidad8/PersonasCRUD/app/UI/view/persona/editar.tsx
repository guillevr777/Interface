import { Persona } from '@/app/domain/entities/Persona';
import { useLocalSearchParams, useRouter } from 'expo-router'; // ✅ Cambio aquí
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { CRUDPersonaVM } from '../../viewmodel/PersonasVM';


export default function EditarPersona() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ Cambio aquí
  const [vm] = useState(() => new CRUDPersonaVM());
  const [persona, setPersona] = useState<Persona>(new Persona());
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (params.id) {
      setModoEdicion(true);
      vm.obtener(Number(params.id)).then(p => p && setPersona(p));
    }
  }, [params.id]);

  const handleGuardar = async () => {
    const success = modoEdicion ? await vm.actualizar(persona) : await vm.crear(persona);
    if (success) router.back();
    else alert(vm.error);
  };

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>{modoEdicion ? 'Editar Persona' : 'Nueva Persona'}</Text>
      <TextInput style={s.input} placeholder="Nombre" value={persona.Nombre} onChangeText={t => setPersona({ ...persona, Nombre: t })} />
      <TextInput style={s.input} placeholder="Apellidos" value={persona.Apellidos} onChangeText={t => setPersona({ ...persona, Apellidos: t })} />
      <TouchableOpacity style={s.saveBtn} onPress={handleGuardar}>
        <Text style={s.saveBtnText}>{modoEdicion ? 'Guardar Cambios' : 'Crear Persona'}</Text>
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