import { Departamento } from '../../domain/entities/Departamento';
import { IDepartamentoRepository } from '../../domain/repositories/IDepartamentoRepository';
import { Connection } from '../database/connection';

export class DepartamentoRepository implements IDepartamentoRepository {
  private baseURL: string;

  constructor() {
    this.baseURL = Connection.getConnection().getBaseURL();
  }

  async listar(): Promise<Departamento[]> {
    try {
      // Probar ambas URLs
      let response = await fetch(`${this.baseURL}/departamentos`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // Si falla con minúscula, intentar con mayúscula
      if (!response.ok) {
        response = await fetch(`${this.baseURL}/Departamentos`, {
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
      
      return data.map((d: any) => new Departamento(d.id, d.nombre));
    } catch (error) {
      console.error('Error al listar departamentos:', error);
      return [];
    }
  }

  async editar(id: number): Promise<Departamento | null> {
    try {
      // GET para obtener datos: /api/Departamentos/{id}
      const response = await fetch(`${this.baseURL}/Departamentos/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const d = await response.json();
      return new Departamento(d.id, d.nombre);
    } catch (error) {
      console.error('Error al editar departamento:', error);
      return null;
    }
  }

  async insertar(departamento: Departamento): Promise<boolean> {
    try {
      // POST para crear: /Departamentos/Create
      const response = await fetch(`${this.baseURL.replace('/api', '')}/Departamentos/Create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ nombre: departamento.nombre })
      });
      
      console.log('Insert response status:', response.status);
      return response.ok || response.status === 302;
    } catch (error) {
      console.error('Error al insertar departamento:', error);
      return false;
    }
  }

  async actualizar(departamento: Departamento): Promise<boolean> {
    try {
      // POST para editar: /Departamentos/Edit/{id}
      const response = await fetch(`${this.baseURL.replace('/api', '')}/Departamentos/Edit/${departamento.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: departamento.id,
          nombre: departamento.nombre
        })
      });
      
      console.log('Update response status:', response.status);
      return response.ok || response.status === 302;
    } catch (error) {
      console.error('Error al actualizar departamento:', error);
      return false;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      // DELETE: /api/Departamentos/{id}
      const response = await fetch(`${this.baseURL}/Departamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Delete response status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Error al eliminar departamento:', error);
      return false;
    }
  }
}