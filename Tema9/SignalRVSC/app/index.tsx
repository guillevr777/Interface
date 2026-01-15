import React from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatViewModel } from './UI/VM/useChatViewModel';

const ChatApp = () => {
  const { 
    messages, currentUser, setCurrentUser, 
    currentMessage, setCurrentMessage, send 
  } = useChatViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nombre de Usuario"
          value={currentUser}
          onChangeText={setCurrentUser}
          style={styles.input}
        />
        <TextInput
          placeholder="Escribe un mensaje..."
          value={currentMessage}
          onChangeText={setCurrentMessage}
          style={styles.input}
        />
        <Button title="Enviar Mensaje" onPress={send} color="#007AFF" />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.userLabel}>{item.nombre}:</Text>
            <Text style={styles.messageText}>{item.mensaje}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  inputContainer: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    elevation: 3,
    marginBottom: 20 
  },
  input: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 15, padding: 8 },
  messageItem: { 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 8, 
    marginBottom: 8,
    flexDirection: 'row' 
  },
  userLabel: { fontWeight: 'bold', color: '#007AFF', marginRight: 10 },
  messageText: { color: '#333' }
});

export default ChatApp;