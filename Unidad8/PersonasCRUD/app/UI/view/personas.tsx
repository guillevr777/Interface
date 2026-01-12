import { Departamento } from '@/app/domain/entities/Departamento';
import { Persona } from '@/app/domain/entities/Persona';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
      Alert.alert('Error', 'No se pudieron cargar los datos');
      console.error(error);
    } finally { setLoading(false); }
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

  const handleEliminar = (persona: Persona) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar a ${persona.Nombre} ${persona.Apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          const success = await personaVM.eliminar(persona.ID!);
          if (success) { 
            Alert.alert('Éxito', 'Persona eliminada'); 
            cargarDatos(); 
          }
          else Alert.alert('Error', 'No se pudo eliminar la persona');
        }}
      ]
    );
  };

  const handleGuardar = async () => {
    if (!personaActual.Nombre || !personaActual.Apellidos) {
      Alert.alert('Error', 'Por favor complete nombre y apellidos');
      return;
    }
    if (personaActual.IDDepartamento === 0) {
      Alert.alert('Error', 'Por favor seleccione un departamento');
      return;
    }

    try {
      let success = false;
      if (modoEdicion) {
        success = await personaVM.actualizar(personaActual);
      } else {
        // eliminar ID antes de crear
        const { ID, ...data } = personaActual;
        success = await personaVM.crear(data as Persona);
      }

      if (success) {
        Alert.alert('Éxito', `Persona ${modoEdicion ? 'actualizada' : 'creada'}`);
        setModalVisible(false);
        cargarDatos();
      } else {
        Alert.alert('Error', `No se pudo ${modoEdicion ? 'actualizar' : 'crear'} la persona`);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      console.error(error);
    }
  };

  const getNombreDepartamento = (id: number) => {
    const dept = departamentos.find(d => d.id === id);
    return dept ? dept.nombre : 'Sin departamento';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando personas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Listado de Personas</Text>
        <Text style={styles.headerSubtitle}>Total: {personas.length}</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleNuevo}>
        <Text style={styles.addButtonText}>➕ Crear Nueva Persona</Text>
      </TouchableOpacity>

      {personas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📋 No hay personas registradas</Text>
        </View>
      ) : (
        <FlatList
          data={personas}
          keyExtractor={item => item.ID!.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>👤 {item.Nombre} {item.Apellidos}</Text>
                <Text style={styles.itemSubtitle}>🎂 {item.FechaNacimiento.split('T')[0]}</Text>
                <Text style={styles.itemSubtitle}>🏢 {getNombreDepartamento(item.IDDepartamento)}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEditar(item)}>
                  <Text style={styles.buttonText}>✏️ Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleEliminar(item)}>
                  <Text style={styles.buttonText}>🗑️ Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButton}>✕ Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modoEdicion ? '✏️ Modificar Persona' : '➕ Crear Persona'}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={personaActual.Nombre}
              onChangeText={text => setPersonaActual({ ...personaActual, Nombre: text })}
              placeholder="Nombre"
            />

            <Text style={styles.label}>Apellidos *</Text>
            <TextInput
              style={styles.input}
              value={personaActual.Apellidos}
              onChangeText={text => setPersonaActual({ ...personaActual, Apellidos: text })}
              placeholder="Apellidos"
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={personaActual.Telefono}
              onChangeText={text => setPersonaActual({ ...personaActual, Telefono: text })}
              placeholder="Teléfono"
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={personaActual.Direccion}
              onChangeText={text => setPersonaActual({ ...personaActual, Direccion: text })}
              placeholder="Dirección"
            />

            <Text style={styles.label}>Foto URL</Text>
            <TextInput
              style={styles.input}
              value={personaActual.FotoURL}
              onChangeText={text => setPersonaActual({ ...personaActual, FotoURL: text })}
              placeholder="URL de la foto"
            />

            <Text style={styles.label}>Fecha de nacimiento</Text>
            <TextInput
              style={styles.input}
              value={personaActual.FechaNacimiento.split('T')[0]}
              onChangeText={text => setPersonaActual({ ...personaActual, FechaNacimiento: new Date(text).toISOString() })}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Departamento *</Text>
            {departamentos.map(dept => (
              <TouchableOpacity
                key={dept.id}
                style={[styles.pickerOption, personaActual.IDDepartamento === dept.id && styles.pickerOptionSelected]}
                onPress={() => setPersonaActual({ ...personaActual, IDDepartamento: dept.id })}
              >
                <Text style={[styles.pickerOptionText, personaActual.IDDepartamento === dept.id && styles.pickerOptionTextSelected]}>
                  {personaActual.IDDepartamento === dept.id ? '✓ ' : ''}{dept.nombre}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
              <Text style={styles.saveButtonText}>{modoEdicion ? '💾 Guardar cambios' : '💾 Crear Persona'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  headerContainer: { backgroundColor: '#007AFF', padding: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: '#E3F2FD' },
  addButton: { backgroundColor: '#34C759', padding: 16, margin: 20, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 20, color: '#666', marginBottom: 10, textAlign: 'center' },
  listItem: { backgroundColor: '#fff', padding: 16, marginHorizontal: 20, marginBottom: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { flex: 1, marginRight: 10 },
  itemTitle: { fontSize: 17, fontWeight: '600', color: '#333', marginBottom: 6 },
  itemSubtitle: { fontSize: 14, color: '#666', marginBottom: 3 },
  itemActions: { flexDirection: 'column', gap: 8 },
  editButton: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 100 },
  deleteButton: { backgroundColor: '#FF3B30', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, minWidth: 100 },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  modalCloseButton: { fontSize: 16, color: '#fff', fontWeight: '600', marginBottom: 10 },
  modalTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, backgroundColor: '#f9f9f9', color: '#333' },
  pickerOption: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 10, backgroundColor: '#fff' },
  pickerOptionSelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  pickerOptionText: { fontSize: 16, color: '#333' },
  pickerOptionTextSelected: { color: '#fff', fontWeight: '600' },
  saveButton: { backgroundColor: '#34C759', padding: 16, borderRadius: 12, marginTop: 30, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
