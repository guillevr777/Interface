import { Persona } from '../../domain/entities/Persona';
import { IPersonaRepository } from '../../domain/repositories/IPersonaRepository';
import { Connection } from '../database/connection';

export class PersonasRepository implements IPersonaRepository {
  private baseURL: string;

  constructor() {
    this.baseURL = Connection.getConnection().getBaseURL();
  }

  async listar(): Promise<Persona[]> {
    try {
      const response = await fetch(`${this.baseURL}/Persona`);
      const data = await response.json();
      return data.map((p: any) => new Persona(
        p.nombre, p.apellidos, p.telefono, p.direccion,
        p.fotoURL, p.fechaNacimiento, p.idDepartamento, p.id,
        p.nombreDepartamento 
      ));
    } catch (error) {
      return [];
    }
  }

  async obtener(id: number): Promise<Persona | null> {
    try {
      const response = await fetch(`${this.baseURL}/Persona/${id}`);
      if (!response.ok) return null;
      const p = await response.json();
      return new Persona(
        p.nombre, p.apellidos, p.telefono, p.direccion,
        p.fotoURL, p.fechaNacimiento, p.idDepartamento, p.id,
        p.nombreDepartamento
      );
    } catch { return null; }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/Persona/${id}`, { method: 'DELETE' });
      return response.ok;
    } catch { return false; }
  }

  async actualizar(persona: Persona): Promise<boolean> {
    try {
      if (!persona.ID) return false;

      const dto = {
        id: Number(persona.ID),
        nombre: persona.Nombre,
        apellidos: persona.Apellidos,
        telefono: persona.Telefono,
        direccion: persona.Direccion, // Calle
        fotoURL: persona.FotoURL || "",
        fechaNacimiento: persona.FechaNacimiento.split('T')[0],
        idDepartamento: Number(persona.IDDepartamento)
      };

      const response = await fetch(`${this.baseURL}/Persona/${persona.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async insertar(persona: Persona): Promise<boolean> {
    try {
      const dto = {
        nombre: persona.Nombre,
        apellidos: persona.Apellidos,
        telefono: persona.Telefono,
        direccion: persona.Direccion, // Calle
        fotoURL: persona.FotoURL || "",
        fechaNacimiento: persona.FechaNacimiento.split('T')[0],
        idDepartamento: Number(persona.IDDepartamento)
      };

      console.log("Intentando crear persona:", JSON.stringify(dto));

      const response = await fetch(`${this.baseURL}/Persona`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dto)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Detalle error crear:", errorText);
      }

      return response.ok;
    } catch (error) {
      console.error("Error conexión crear:", error);
      return false;
    }
  }
}