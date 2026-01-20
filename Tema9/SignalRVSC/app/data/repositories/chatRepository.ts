import { clsMensajeUsuario } from "../../domain/entities/clsMensajeUsuario";
import { IChatRepository } from "../../domain/repositories/IChatRepository";
import { SignalRChatDataSource } from "../datasource/SignalRChatDataSource";

export class ChatRepository implements IChatRepository {
  constructor(private dataSource: SignalRChatDataSource) {}

  async connect(): Promise<void> {
    await this.dataSource.start();
  }

  async sendMessage(mensaje: clsMensajeUsuario): Promise<void> {
    await this.dataSource.sendMessage(mensaje);
  }

  onMessageReceived(callback: (mensaje: clsMensajeUsuario) => void): void {
    this.dataSource.onReceive(callback);
  }
}
