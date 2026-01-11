import { Persona } from '../entities/Persona';
import { IPersonaRepository } from '../repositories/IPersonaRepository';

export class CRUDPersonasUseCase {
  constructor(private repository: IPersonaRepository) {}

  async listarPersonas(): Promise<Persona[]> {
    return await this.repository.listar();
  }

  async editarPersona(id: number): Promise<Persona | null> {
    return await this.repository.editar(id);
  }

  async insertarPersona(persona: Persona): Promise<boolean> {
    return await this.repository.insertar(persona);
  }

  async actualizarPersona(persona: Persona): Promise<boolean> {
    return await this.repository.actualizar(persona);
  }

  async eliminarPersona(id: number): Promise<boolean> {
    return await this.repository.eliminar(id);
  }
}