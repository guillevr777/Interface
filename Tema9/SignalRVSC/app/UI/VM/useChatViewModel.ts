import { clsMensajeUsuario } from "../../domain/entities/clsMensajeUsuario";
import { IChatRepository } from "../../domain/repositories/IChatRepository";

export class ChatViewModel {
  private mensajes: clsMensajeUsuario[] = [];
  private onUpdate?: (mensajes: clsMensajeUsuario[]) => void;

  constructor(private chatRepository: IChatRepository) {}

  async init() {
    await this.chatRepository.connect();

    this.chatRepository.onMessageReceived((mensaje) => {
      this.mensajes = [...this.mensajes, mensaje];
      this.onUpdate?.(this.mensajes);
    });
  }

send(mensaje: { Nombre: string; Mensaje: string }) {
  return this.chatRepository.sendMessage(mensaje);
}


  subscribe(callback: (mensajes: clsMensajeUsuario[]) => void) {
    this.onUpdate = callback;
  }
}
