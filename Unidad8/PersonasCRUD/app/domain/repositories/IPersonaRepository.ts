import { Persona } from '../entities/Persona';

export interface IPersonaRepository {
  listar(): Promise<Persona[]>;
  editar(id: number): Promise<Persona | null>;
  insertar(persona: Persona): Promise<boolean>;
  actualizar(persona: Persona): Promise<boolean>;
  eliminar(id: number): Promise<boolean>;
}