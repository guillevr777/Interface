import { clsMensajeUsuario } from "../../domain/entities/clsMensajeUsuario";

export interface IChatRepository {
  connect(): Promise<void>;
  sendMessage(mensaje: clsMensajeUsuario): Promise<void>;
  onMessageReceived(callback: (mensaje: clsMensajeUsuario) => void): void;
}
