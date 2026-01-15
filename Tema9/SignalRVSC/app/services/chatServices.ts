// Solución al error __non_webpack_require__
if (typeof (global as any).__non_webpack_require__ === 'undefined') {
  (global as any).__non_webpack_require__ = () => {
    throw new Error('__non_webpack_require__ no está soportado en React Native');
  };
}

import * as signalR from '@microsoft/signalr';
import { clsMensajeUsuario } from '../UI/Models/clsMensajeModelo';

class ChatService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://signalr20260115133324-b8fyfga2f2a5gtd2.spaincentral-01.azurewebsites.net/chatHub") // Cambia a tu nueva URL de Azure
      .withAutomaticReconnect()
      .build();
  }

  async startConnection(onMessageReceived: (data: clsMensajeUsuario) => void) {
    try {
      await this.connection.start();
      console.log('Conectado a Azure SignalR');
      
      // Ahora recibe un objeto único en lugar de dos strings
      this.connection.on("ReceiveMessage", (data: clsMensajeUsuario) => {
        onMessageReceived(data);
      });
    } catch (err) {
      console.error("Error al conectar", err);
    }
  }

  async sendMessage(data: clsMensajeUsuario) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      // Enviamos un solo objeto
      await this.connection.invoke("SendMessage", data);
    }
  }
}

export const chatService = new ChatService();