import { Persona } from '../../domain/entities/Persona';
import { IPersonaRepository } from '../../domain/repositories/IPersonaRepository';
import { Connection } from '../database/connection';

export class PersonasRepository implements IPersonaRepository {
  private baseURL: string;

  constructor() {
    this.baseURL = Connection.getConnection().getBaseURL();
  }

  // Cambiado a 'obtener' para cumplir la interfaz
  async obtener(id: number): Promise<Persona | null> {
    try {
      const response = await fetch(`${this.baseURL}/Persona/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.status === 404) return null;

      const p = await response.json();
      return new Persona(
        p.nombre,
        p.apellidos,
        p.telefono,
        p.direccion,
        p.fotoURL,
        p.fechaNacimiento,
        p.idDepartamento,
        p.id // ID opcional al final
      );
    } catch (error) {
      console.error('Error al obtener persona', error);
      return null;
    }
  }

  async listar(): Promise<Persona[]> {
    try {
      const response = await fetch(`${this.baseURL}/Persona`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.status === 204) return [];

      const data = await response.json();
      return data.map((p: any) => new Persona(
        p.nombre,
        p.apellidos,
        p.telefono,
        p.direccion,
        p.fotoURL,
        p.fechaNacimiento,
        p.idDepartamento,
        p.id
      ));
    } catch (error) {
      console.error('Error al listar personas', error);
      return [];
    }
  }

  async insertar(persona: Persona): Promise<boolean> {
    try {
      // eliminar ID al crear
      const { ID, ...data } = persona;

      const response = await fetch(`${this.baseURL}/Persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      return response.status === 201 || response.ok;
    } catch (error) {
      console.error('Error al insertar persona', error);
      return false;
    }
  }

  async actualizar(persona: Persona): Promise<boolean> {
    try {
      if (!persona.ID) return false;

      const response = await fetch(`${this.baseURL}/Persona/${persona.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(persona)
      });

      return response.ok;
    } catch (error) {
      console.error('Error al actualizar persona', error);
      return false;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/Persona/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('Error al eliminar persona', error);
      return false;
    }
  }
}
