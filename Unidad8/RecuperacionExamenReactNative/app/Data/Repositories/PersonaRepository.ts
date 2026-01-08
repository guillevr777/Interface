
import { Persona } from "../../Domain/Entities/Persona";
import { PersonaRepository } from "../../Domain/Repositories/PersonaRepository";
import { API_CONFIG } from "../DataBase/ApiConnection";

export class PersonaRepositoryApi implements PersonaRepository {
  async getPersonas(): Promise<Persona[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/personas`);
    if (!response.ok) throw new Error("No se pudo cargar las personas");

    const data = await response.json();

    return data.map((p: any) => 
        new Persona(
            p.id, 
            p.nombre, 
            p.apellidos, 
            (p.departamentoId || p.departmentId || p.idDepartamento || 0) as number
        )
    );
  }
}