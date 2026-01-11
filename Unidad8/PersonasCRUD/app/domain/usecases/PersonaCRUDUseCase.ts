import { PersonasRepository } from '../../data/repositories/PersonasRepository';
import { Persona } from '../entities/Persona';

export class CRUDPersonaUseCase {
  private repository: PersonasRepository;

  constructor(repository: PersonasRepository) {
    this.repository = repository;
  }

  async listarPersonas(): Promise<Persona[]> {
    return await this.repository.listar();
  }

  async obtenerPersona(id: number): Promise<Persona | null> {
    return await this.repository.obtener(id);
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
