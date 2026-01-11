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
      // Probar ambas URLs por si acaso
      let response = await fetch(`${this.baseURL}/personas`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Si falla con minúscula, intentar con mayúscula
      if (!response.ok) {
        response = await fetch(`${this.baseURL}/Personas`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('La respuesta no es un array:', data);
        return [];
      }
      
      return data.map((p: any) => 
        new Persona(p.id, p.nombre, p.apellidos, p.edad, p.idDepartamento)
      );
    } catch (error) {
      console.error('Error al listar personas:', error);
      return [];
    }
  }

  async editar(id: number): Promise<Persona | null> {
    try {
      // GET para obtener datos: /api/Personas/{id}
      const response = await fetch(`${this.baseURL}/Personas/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const p = await response.json();
      return new Persona(p.id, p.nombre, p.apellidos, p.edad, p.idDepartamento);
    } catch (error) {
      console.error('Error al editar persona:', error);
      return null;
    }
  }

  async insertar(persona: Persona): Promise<boolean> {
    try {
      // POST para crear: /Personas/Create
      const response = await fetch(`${this.baseURL.replace('/api', '')}/Personas/Create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nombre: persona.nombre,
          apellidos: persona.apellidos,
          edad: persona.edad,
          idDepartamento: persona.idDepartamento
        })
      });
      
      console.log('Insert response status:', response.status);
      return response.ok || response.status === 302; // 302 es redirect después de crear
    } catch (error) {
      console.error('Error al insertar persona:', error);
      return false;
    }
  }

  async actualizar(persona: Persona): Promise<boolean> {
    try {
      // POST para editar: /Personas/Edit/{id}
      const response = await fetch(`${this.baseURL.replace('/api', '')}/Personas/Edit/${persona.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: persona.id,
          nombre: persona.nombre,
          apellidos: persona.apellidos,
          edad: persona.edad,
          idDepartamento: persona.idDepartamento
        })
      });
      
      console.log('Update response status:', response.status);
      return response.ok || response.status === 302; // 302 es redirect después de actualizar
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      return false;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      // DELETE: /api/Personas/{id}
      const response = await fetch(`${this.baseURL}/Personas/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Delete response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      return false;
    }
  }
}