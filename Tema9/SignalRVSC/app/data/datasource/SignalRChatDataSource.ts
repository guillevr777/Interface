import * as signalR from "@microsoft/signalr";
import { clsMensajeUsuario } from "../../domain/entities/clsMensajeUsuario";

export class SignalRChatDataSource {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://signalr20260115133324-b8fyfga2f2a5gtd2.spaincentral-01.azurewebsites.net/chatHub")
      .withAutomaticReconnect()
      .build();
  }

  async start(): Promise<void> {
    await this.connection.start();
  }

  async sendMessage(mensaje: { Nombre: string; Mensaje: string }): Promise<void> {
    await this.connection.invoke("SendMessage", mensaje);
  }   


  onReceive(callback: (mensaje: clsMensajeUsuario) => void): void {
    this.connection.on("ReceiveMessage", (mensaje: clsMensajeUsuario) => {
      callback(mensaje);
    });
  }

  getState() {
    return this.connection.state;
  }
}
