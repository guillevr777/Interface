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
  
  useEffect(() => {
    cargarDatos();
  }, []);
  
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
    setPersonaActual({...persona});
    setModoEdicion(true);
    setModalVisible(true);
  };
  
  const handleEliminar = (persona: Persona) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar a ${persona.nombre} ${persona.apellidos}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            const success = await personaVM.eliminar(persona.id);
            if (success) {
              Alert.alert('Éxito', 'Persona eliminada correctamente');
              cargarDatos();
            } else {
              Alert.alert('Error', 'No se pudo eliminar la persona');
            }
          }
        }
      ]
    );
  };
  
  const handleGuardar = async () => {
    if (!personaActual.nombre || !personaActual.apellidos) {
      Alert.alert('Error', 'Por favor complete nombre y apellidos');
      return;
    }

    if (personaActual.idDepartamento === 0) {
      Alert.alert('Error', 'Por favor seleccione un departamento');
      return;
    }
    
    try {
      const success = modoEdicion 
        ? await personaVM.actualizar(personaActual)
        : await personaVM.crear(personaActual);
      
      if (success) {
        Alert.alert('Éxito', `Persona ${modoEdicion ? 'actualizada' : 'creada'} correctamente`);
        setModalVisible(false);
        cargarDatos();
      } else {
        Alert.alert('Error', `No se pudo ${modoEdicion ? 'actualizar' : 'crear'} la persona`);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };
  
  const getNombreDepartamento = (idDepartamento: number): string => {
    const dept = departamentos.find(d => d.id === idDepartamento);
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
        <Text style={styles.headerSubtitle}>Total: {personas.length} persona(s)</Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleNuevo}
      >
        <Text style={styles.addButtonText}>➕ Crear Nueva Persona</Text>
      </TouchableOpacity>

      {personas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📋 No hay personas registradas</Text>
          <Text style={styles.emptySubtext}>Presiona "Crear Nueva Persona" para añadir una</Text>
        </View>
      ) : (
        <FlatList
          data={personas}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>
                  👤 {item.nombre} {item.apellidos}
                </Text>
                <Text style={styles.itemSubtitle}>🎂 Edad: {item.edad} años</Text>
                <Text style={styles.itemSubtitle}>
                  🏢 {getNombreDepartamento(item.idDepartamento)}
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditar(item)}
                >
                  <Text style={styles.buttonText}>✏️ Modificar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleEliminar(item)}
                >
                  <Text style={styles.buttonText}>🗑️ Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      
      {/* Modal de Edición/Creación */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={styles.closeButtonContainer}
            >
              <Text style={styles.modalCloseButton}>✕ Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {modoEdicion ? '✏️ Modificar Persona' : '➕ Crear Nueva Persona'}
            </Text>
          </View>
          
          <View style={styles.form}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={personaActual.nombre}
              onChangeText={(text) => setPersonaActual({...personaActual, nombre: text})}
              placeholder="Ingrese el nombre"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Apellidos *</Text>
            <TextInput
              style={styles.input}
              value={personaActual.apellidos}
              onChangeText={(text) => setPersonaActual({...personaActual, apellidos: text})}
              placeholder="Ingrese los apellidos"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Edad</Text>
            <TextInput
              style={styles.input}
              value={personaActual.edad === 0 ? '' : personaActual.edad.toString()}
              onChangeText={(text) => setPersonaActual({...personaActual, edad: parseInt(text) || 0})}
              placeholder="Ingrese la edad"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Departamento *</Text>
            {departamentos.length === 0 ? (
              <Text style={styles.warningText}>⚠️ No hay departamentos disponibles</Text>
            ) : (
              <View style={styles.pickerContainer}>
                {departamentos.map(dept => (
                  <TouchableOpacity
                    key={dept.id}
                    style={[
                      styles.pickerOption,
                      personaActual.idDepartamento === dept.id && styles.pickerOptionSelected
                    ]}
                    onPress={() => setPersonaActual({...personaActual, idDepartamento: dept.id})}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      personaActual.idDepartamento === dept.id && styles.pickerOptionTextSelected
                    ]}>
                      {personaActual.idDepartamento === dept.id ? '✓ ' : ''}{dept.nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
              <Text style={styles.saveButtonText}>
                💾 {modoEdicion ? 'Guardar Cambios' : 'Crear Persona'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 16,
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  itemActions: {
    flexDirection: 'column',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButtonContainer: {
    marginBottom: 10,
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  warningText: {
    color: '#FF9500',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 5,
  },
  pickerContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  pickerOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});