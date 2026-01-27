import * as signalR from "@microsoft/signalr";
import { clsMensajeUsuario } from "../../domain/entities/clsMensajeUsuario";

export class SignalRChatDataSource {
  private connection: signalR.HubConnection;
  private startPromise: Promise<void> | null = null;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://signalr20260115133324-b8fyfga2f2a5gtd2.spaincentral-01.azurewebsites.net/chatHub")
      .withAutomaticReconnect()
      .build();

    // Optional but VERY useful for debugging
    this.connection.onreconnecting(() => console.log("SignalR reconnecting..."));
    this.connection.onreconnected(() => console.log("SignalR reconnected"));
    this.connection.onclose(() => console.log("SignalR closed"));
  }

  /** Ensures only ONE start() runs at a time */
  private async ensureConnected(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (!this.startPromise) {
      this.startPromise = this.connection.start().finally(() => {
        this.startPromise = null;
      });
    }

    await this.startPromise;
  }

  async start(): Promise<void> {
    await this.ensureConnected();
  }

  async sendMessage(mensaje: { Nombre: string; Mensaje: string }): Promise<void> {
    await this.ensureConnected(); // ⭐ THE KEY LINE
    await this.connection.invoke(
    "SendMessage",
    mensaje.Nombre,
    mensaje.Mensaje
    );
  }

  onReceive(callback: (mensaje: clsMensajeUsuario) => void): void {
    this.connection.on("ReceiveMessage", callback);
  }

  getState() {
    return this.connection.state;
  }
}
