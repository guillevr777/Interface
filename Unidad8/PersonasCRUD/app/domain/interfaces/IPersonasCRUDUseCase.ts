import { Persona } from '../entities/Persona';

export interface ICRUDPersonasUseCase {
  listarPersonas(): Promise<Persona[]>;
  obtenerPersonaPorId(id: number): Promise<Persona>;
  insertarPersona(persona: Persona): Promise<boolean>;
  actualizarPersona(persona: Persona): Promise<boolean>;
  eliminarPersona(id: number): Promise<boolean>;
}