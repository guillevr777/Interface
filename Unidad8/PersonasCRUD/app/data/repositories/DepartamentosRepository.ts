import { Departamento } from '../../domain/entities/Departamento';
import { IDepartamentoRepository } from '../../domain/repositories/IDepartamentoRepository';
import { Connection } from '../database/connection';

export class DepartamentoRepository implements IDepartamentoRepository {

  private baseURL: string;

  constructor() {
    this.baseURL = Connection.getConnection().getBaseURL(); // .../api
  }

  // ======================
  // GET /api/Departamentos
  // ======================
  async listar(): Promise<Departamento[]> {
    try {
      const response = await fetch(`${this.baseURL}/Departamentos`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();

      return data.map((d: any) =>
        new Departamento(d.id ?? d.ID, d.nombre ?? d.Nombre)
      );
    } catch (error) {
      console.error('Error al listar departamentos', error);
      return [];
    }
  }

  // ======================
  // GET /api/Departamentos/{id}
  // ======================
  async editar(id: number): Promise<Departamento | null> {
    try {
      const response = await fetch(`${this.baseURL}/Departamentos/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.status === 404) return null;

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const d = await response.json();
      return new Departamento(d.id ?? d.ID, d.nombre ?? d.Nombre);
    } catch (error) {
      console.error('Error al obtener departamento', error);
      return null;
    }
  }

  // ======================
  // POST /api/Departamentos
  // ======================
  async insertar(departamento: Departamento): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/Departamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nombre: departamento.nombre
        })
      });

      return response.status === 201 || response.ok;
    } catch (error) {
      console.error('Error al insertar departamento', error);
      return false;
    }
  }

  // ======================
  // PUT /api/Departamentos/{id}
  // ======================
  async actualizar(departamento: Departamento): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseURL}/Departamentos/${departamento.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: departamento.id,
            nombre: departamento.nombre
          })
        }
      );

      return response.status === 204 || response.ok;
    } catch (error) {
      console.error('Error al actualizar departamento', error);
      return false;
    }
  }

  // ======================
  // DELETE /api/Departamentos/{id}
  // ======================
  async eliminar(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/Departamentos/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });

      return response.status === 204 || response.ok;
    } catch (error) {
      console.error('Error al eliminar departamento', error);
      return false;
    }
  }
}
