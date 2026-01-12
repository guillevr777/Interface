import Container from '../../container/core';
import { IViewModel } from '../../container/types';
import { Persona } from '../../domain/entities/Persona';

export class CRUDPersonaVM implements IViewModel<Persona> {
  private useCase;

  constructor() {
    this.useCase = Container.getInstance().getCRUDPersonasUseCase();
  }

  async listar(): Promise<Persona[]> {
    return await this.useCase.listarPersonas();
  }

  async obtener(id: number): Promise<Persona | null> {
    return await this.useCase.obtenerPersona(id);
  }

  async crear(persona: Persona): Promise<boolean> {
    const { ID, ...data } = persona;
    return await this.useCase.insertarPersona(data as Persona);
  }

  async actualizar(persona: Persona): Promise<boolean> {
    return await this.useCase.actualizarPersona(persona);
  }

  async eliminar(id: number): Promise<boolean> {
    return await this.useCase.eliminarPersona(id);
  }
}
