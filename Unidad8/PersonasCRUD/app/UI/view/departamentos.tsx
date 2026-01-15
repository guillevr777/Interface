import { Departamento } from '@/app/domain/entities/Departamento';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CRUDDepartamentoVM } from '../viewmodel/DepartamentosVM';

export default function VistaCRUDDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [departamentoActual, setDepartamentoActual] = useState(new Departamento());
  
  const departamentoVM = new CRUDDepartamentoVM();
  
  useEffect(() => {
    cargarDatos();
  }, []);
  
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await departamentoVM.listar();
      setDepartamentos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los departamentos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNuevo = () => {
    setDepartamentoActual(new Departamento());
    setModoEdicion(false);
    setModalVisible(true);
  };
  
  const handleEditar = (departamento: Departamento) => {
    setDepartamentoActual({...departamento});
    setModoEdicion(true);
    setModalVisible(true);
  };
  
  const handleEliminar = (departamento: Departamento) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Está seguro de eliminar el departamento "${departamento.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            const success = await departamentoVM.eliminar(departamento.id);
            if (success) {
              Alert.alert('Éxito', 'Departamento eliminado correctamente');
              cargarDatos();
            } else {
              Alert.alert('Error', 'No se pudo eliminar el departamento. Puede tener personas asociadas.');
            }
          }
        }
      ]
    );
  };
  
  const handleGuardar = async () => {
    if (!departamentoActual.nombre || departamentoActual.nombre.trim().length === 0) {
      Alert.alert('Error', 'Por favor complete el nombre del departamento');
      return;
    }
    
    try {
      const success = modoEdicion 
        ? await departamentoVM.actualizar(departamentoActual)
        : await departamentoVM.crear(departamentoActual);
      
      if (success) {
        Alert.alert('Éxito', `Departamento ${modoEdicion ? 'actualizado' : 'creado'} correctamente`);
        setModalVisible(false);
        cargarDatos();
      } else {
        Alert.alert('Error', `No se pudo ${modoEdicion ? 'actualizar' : 'crear'} el departamento`);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={styles.loadingText}>Cargando departamentos...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Listado de Departamentos</Text>
        <Text style={styles.headerSubtitle}>Total: {departamentos.length} departamento(s)</Text>
      </View>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleNuevo}
      >
        <Text style={styles.addButtonText}>➕ Crear Nuevo Departamento</Text>
      </TouchableOpacity>

      {departamentos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🏢 No hay departamentos registrados</Text>
          <Text style={styles.emptySubtext}>Presiona "Crear Nuevo Departamento" para añadir uno</Text>
        </View>
      ) : (
        <FlatList
          data={departamentos}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>🏢 {item.nombre}</Text>
                <Text style={styles.itemId}>ID: {item.id}</Text>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={styles.closeButtonContainer}
            >
              <Text style={styles.modalCloseButton}>✕ Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {modoEdicion ? '✏️ Modificar Departamento' : '➕ Crear Nuevo Departamento'}
            </Text>
          </View>
          
          <View style={styles.form}>
            <Text style={styles.label}>Nombre del Departamento *</Text>
            <TextInput
              style={styles.input}
              value={departamentoActual.nombre}
              onChangeText={(text) => setDepartamentoActual({...departamentoActual, nombre: text})}
              placeholder="Ingrese el nombre del departamento"
              placeholderTextColor="#999"
            />
            
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleGuardar}
            >
              <Text style={styles.saveButtonText}>
                💾 {modoEdicion ? 'Guardar Cambios' : 'Crear Departamento'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: '#FF9500',
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
    color: '#FFE5CC',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemId: {
    fontSize: 13,
    color: '#999',
  },
  itemActions: {
    flexDirection: 'column',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 105,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 105,
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
    backgroundColor: '#FF9500',
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