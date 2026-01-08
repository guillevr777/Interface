import { Persona } from "../Entities/Persona";

export interface PersonaRepository {
  getPersonas(): Promise<Persona[]>;
}