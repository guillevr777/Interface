
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import '../../Container/core';
import { useGameViewModel } from "../ViewModel/JuegoViewModel";

export default function GameScreen() {
  const vm = useGameViewModel();

  const isWinner = vm.resultado.includes("¡Has ganado!");
  const isError = vm.resultado.includes('⚠️');

  const resultStyle = vm.resultado
    ? [
        styles.resultText, 
        { 
          backgroundColor: isWinner ? '#E8F5E9' : (isError ? styles.errorText.backgroundColor : '#FFEBEE'),
          color: isWinner ? '#388E3C' : (isError ? styles.errorText.color : '#D32F2F'),
          borderColor: isWinner ? '#81C784' : (isError ? styles.errorText.borderColor : '#E57373'),
        }
      ]
    : null;

  if (vm.loading) {
    return <Text style={styles.loadingText}>Cargando datos de la API de Azure...</Text>;
  }

  const personasCargadas = vm.personas.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adivina el Departamento</Text>

      {!personasCargadas && isError ? (
        <Text style={resultStyle}>{vm.resultado}</Text>
      ) : (
        <View style={styles.listContainer}> 
          <FlatList
                contentContainerStyle={styles.flatlistContent} 
            data={vm.personas}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const color = vm.departamentos.find(d => d.id === item.departamentoId)?.color || "#F0F0F0"; 

              return (
                <View
                  style={[
                    styles.personCard,
                    { backgroundColor: color + 'AA' }, 
                  ]}
                >
                  <Text style={styles.personName}>
                    {item.nombre} {item.apellidos}
                  </Text>

                  <Picker<number>
                    selectedValue={vm.selecciones[item.id] ?? 0}
                    onValueChange={value => vm.seleccionarDepartamento(item.id, value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="-- Selecciona departamento --" value={0} />
                    {vm.departamentos.map(d => (
                      <Picker.Item key={d.id} label={d.nombre} value={d.id} />
                    ))}
                  </Picker>
                </View>
              );
            }}
          />
        </View>
      )}

      {vm.resultado && !isError ? (
        <Text style={resultStyle}>{vm.resultado}</Text>
      ) : null}

      {personasCargadas && (
        <Button 
          title="Comprobar Respuestas" 
          onPress={vm.comprobar} 
          color="#007BFF"
        />
      )}
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 10, 
    backgroundColor: '#F8F9FA', 
   
  },
  listContainer: {
    width: '100%', 
    flex: 1, 
  },
  flatlistContent: {
    paddingBottom: 20, 
  },
  loadingText: {
    padding: 10,
    fontSize: 16, 
    textAlign: 'center',
    color: '#007BFF',
  },
  title: {
    fontSize: 24, 
    fontWeight: '900',
    marginBottom: 15, 
    textAlign: 'center',
    color: '#333',
  },
  personCard: {
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 8,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  personName: {
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 5, 
    color: '#333',
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14, 
  },
  resultText: {
    marginTop: 20, 
    padding: 10, 
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 8, 
    borderWidth: 1,
    marginBottom: 10,
  },
  errorText: { 
    backgroundColor: '#FFE0B2', 
    color: '#E65100', 
    borderColor: '#FFB74D',
  }
});