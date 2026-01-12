import { Departamento } from '@/app/domain/entities/Departamento';
import { Persona } from '@/app/domain/entities/Persona';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CRUDDepartamentoVM } from '../viewmodel/DepartamentosVM';
import { CRUDPersonaVM } from '../viewmodel/PersonasVM';

export default function VistaCRUDPersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [personaActual, setPersonaActual] = useState(new Persona());

  const personaVM = new CRUDPersonaVM();
  const departamentoVM = new CRUDDepartamentoVM();

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [personasData, departamentosData] = await Promise.all([
        personaVM.listar(),
        departamentoVM.listar()
      ]);
      setPersonas(personasData);
      setDepartamentos(departamentosData);
    } catch (error) {
      alert('Error: No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setPersonaActual(new Persona());
    setModoEdicion(false);
    setModalVisible(true);
  };

  const handleEditar = (persona: Persona) => {
    setPersonaActual({ ...persona });
    setModoEdicion(true);
    setModalVisible(true);
  };

  const handleEliminar = async (persona: Persona) => {
    if (!window.confirm(`¿Eliminar a ${persona.Nombre} ${persona.Apellidos}?`)) return;
    
    const success = await personaVM.eliminar(persona.ID!);
    alert(success ? 'Persona eliminada' : 'Error al eliminar');
    if (success) cargarDatos();
  };

  const handleGuardar = async () => {
    if (!personaActual.Nombre || !personaActual.Apellidos) {
      return alert('Complete nombre y apellidos');
    }
    if (personaActual.IDDepartamento === 0) {
      return alert('Seleccione un departamento');
    }

    const { ID, ...data } = personaActual;
    const success = modoEdicion 
      ? await personaVM.actualizar(personaActual)
      : await personaVM.crear(data as Persona);

    if (success) {
      alert(`Persona ${modoEdicion ? 'actualizada' : 'creada'}`);
      setModalVisible(false);
      cargarDatos();
    } else {
      alert('Error al guardar');
    }
  };

  const actualizar = (campo: keyof Persona, valor: any) => {
    setPersonaActual({ ...personaActual, [campo]: valor });
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={s.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Listado de Personas</Text>
        <Text style={s.headerSubtitle}>Total: {personas.length}</Text>
      </View>

      <TouchableOpacity style={s.addBtn} onPress={handleNuevo}>
        <Text style={s.addBtnText}>➕ Crear Nueva Persona</Text>
      </TouchableOpacity>

      {personas.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyText}>📋 No hay personas registradas</Text>
        </View>
      ) : (
        <FlatList
          data={personas}
          keyExtractor={item => item.ID!.toString()}
          renderItem={({ item }) => (
            <View style={s.item}>
              <View style={s.itemInfo}>
                <Text style={s.itemTitle}>👤 {item.Nombre} {item.Apellidos}</Text>
                <Text style={s.itemSub}>🎂 {item.FechaNacimiento.split('T')[0]}</Text>
                <Text style={s.itemSub}>🏢 {departamentos.find(d => d.id === item.IDDepartamento)?.nombre || 'N/A'}</Text>
              </View>
              <View style={s.itemActions}>
                <TouchableOpacity style={s.editBtn} onPress={() => handleEditar(item)}>
                  <Text style={s.btnText}>✏️ Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.delBtn} onPress={() => handleEliminar(item)}>
                  <Text style={s.btnText}>🗑️ Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={s.modal}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={s.closeBtn}>✕ Cancelar</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>{modoEdicion ? '✏️ Modificar' : '➕ Crear'} Persona</Text>
          </View>

          <View style={s.form}>
            <Text style={s.label}>Nombre *</Text>
            <TextInput style={s.input} value={personaActual.Nombre} onChangeText={v => actualizar('Nombre', v)} placeholder="Nombre" />

            <Text style={s.label}>Apellidos *</Text>
            <TextInput style={s.input} value={personaActual.Apellidos} onChangeText={v => actualizar('Apellidos', v)} placeholder="Apellidos" />

            <Text style={s.label}>Teléfono</Text>
            <TextInput style={s.input} value={personaActual.Telefono} onChangeText={v => actualizar('Telefono', v)} placeholder="Teléfono" />

            <Text style={s.label}>Dirección</Text>
            <TextInput style={s.input} value={personaActual.Direccion} onChangeText={v => actualizar('Direccion', v)} placeholder="Dirección" />

            <Text style={s.label}>Foto URL</Text>
            <TextInput style={s.input} value={personaActual.FotoURL} onChangeText={v => actualizar('FotoURL', v)} placeholder="URL" />

            <Text style={s.label}>Fecha de nacimiento</Text>
            <TextInput style={s.input} value={personaActual.FechaNacimiento.split('T')[0]} onChangeText={v => actualizar('FechaNacimiento', new Date(v).toISOString())} placeholder="YYYY-MM-DD" />

            <Text style={s.label}>Departamento *</Text>
            {departamentos.map(dept => (
              <TouchableOpacity
                key={dept.id}
                style={[s.picker, personaActual.IDDepartamento === dept.id && s.pickerSel]}
                onPress={() => actualizar('IDDepartamento', dept.id)}
              >
                <Text style={[s.pickerText, personaActual.IDDepartamento === dept.id && s.pickerTextSel]}>
                  {personaActual.IDDepartamento === dept.id ? '✓ ' : ''}{dept.nombre}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={s.saveBtn} onPress={handleGuardar}>
              <Text style={s.saveBtnText}>{modoEdicion ? '💾 Guardar cambios' : '💾 Crear Persona'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: '#E3F2FD' },
  addBtn: { backgroundColor: '#34C759', padding: 16, margin: 20, borderRadius: 12, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  emptyText: { fontSize: 20, color: '#666', textAlign: 'center' },
  item: { backgroundColor: '#fff', padding: 16, marginHorizontal: 20, marginBottom: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 1, marginRight: 10 },
  itemTitle: { fontSize: 17, fontWeight: '600', color: '#333', marginBottom: 6 },
  itemSub: { fontSize: 14, color: '#666', marginBottom: 3 },
  itemActions: { flexDirection: 'column', gap: 8 },
  editBtn: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 100 },
  delBtn: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 100 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  closeBtn: { fontSize: 16, color: '#fff', fontWeight: '600', marginBottom: 10 },
  modalTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#f9f9f9', color: '#333' },
  picker: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 10, backgroundColor: '#fff' },
  pickerSel: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  pickerText: { fontSize: 16, color: '#333' },
  pickerTextSel: { color: '#fff', fontWeight: '600' },
  saveBtn: { backgroundColor: '#34C759', padding: 16, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});