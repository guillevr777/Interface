import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SignalRChatDataSource } from "./data/datasource/SignalRChatDataSource";
import { ChatRepository } from "./data/repositories/chatRepository";
import { clsMensajeUsuario } from "./domain/entities/clsMensajeUsuario";
import { ChatViewModel } from "./UI/VM/useChatViewModel";

export const ChatScreen = () => {
  const [nombre, setNombre] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");

  const [mensajes, setMensajes] = useState<clsMensajeUsuario[]>([]);
  const [viewModel, setViewModel] = useState<ChatViewModel | null>(null);

  useEffect(() => {
    const dataSource = new SignalRChatDataSource();
    const repository = new ChatRepository(dataSource);
    const vm = new ChatViewModel(repository);

    vm.subscribe(setMensajes);
    vm.init();

    setViewModel(vm);
  }, []);

  const enviar = () => {
  if (!viewModel) return;

  // 👇 Propiedades con MAYÚSCULA EXACTA
  viewModel.send({
    Nombre: nombre,
    Mensaje: mensaje
  });

  setMensaje("");
};


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Usuario"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Mensaje"
        value={mensaje}
        onChangeText={setMensaje}
        style={styles.input}
      />

      <Button title="Enviar" onPress={enviar} />

      <FlatList
        data={mensajes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.bold}>{item.Nombre}:</Text>
            <Text> {item.Mensaje}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 10 },
  messageItem: { flexDirection: "row", marginBottom: 5 },
  bold: { fontWeight: "bold" }
});

export default ChatScreen;