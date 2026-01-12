import { Persona } from '../entities/Persona';

export interface IPersonaRepository {
  listar(): Promise<Persona[]>;
  obtener(id: number): Promise<Persona | null>; // cambié de 'editar' a 'obtener'
  insertar(persona: Persona): Promise<boolean>;
  actualizar(persona: Persona): Promise<boolean>;
  eliminar(id: number): Promise<boolean>;
}
