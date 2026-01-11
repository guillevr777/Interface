import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VistaPrincipal() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD App</Text>
      <Text style={styles.subtitle}>Seleccione una opción</Text>
      
      <TouchableOpacity 
        style={styles.mainButton}
        onPress={() => router.push('/UI/view/personas')}
      >
        <Text style={styles.mainButtonText}>👤 Gestionar Personas</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.mainButton, { backgroundColor: '#FF9500' }]}
        onPress={() => router.push('/UI/view/departamentos')}
      >
        <Text style={styles.mainButtonText}>🏢 Gestionar Departamentos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});