import Container from '../../container/core';
import { IDepartamento, IViewModel } from '../../container/types';
import { Persona } from '../../domain/entities/Persona';

export class CRUDPersonaVM implements IViewModel<Persona> {
  private useCase;
  private deptoUseCase;

  personas: Persona[] = [];
  departamentos: IDepartamento[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    this.useCase = Container.getInstance().getCRUDPersonasUseCase();
    this.deptoUseCase = Container.getInstance().getCRUDDepartamentosUseCase();
  }

  async cargarDepartamentos(): Promise<IDepartamento[]> {
    try {
      this.departamentos = await this.deptoUseCase.listarDepartamentos();
      return this.departamentos;
    } catch (e) {
      this.error = 'Error al cargar departamentos';
      return [];
    }
  }

  async listar(): Promise<Persona[]> {
    this.loading = true;
    this.error = null;
    try {
      this.personas = await this.useCase.listarPersonas();
      return this.personas;
    } catch {
      this.error = 'Error al listar';
      return [];
    } finally {
      this.loading = false;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    this.error = null;
    try {
      return await this.useCase.eliminarPersona(id);
    } catch (e: any) {
      this.error = e.message; // Aquí llega el error del domingo
      return false;
    }
  }

  // Helper para la vista
  obtenerEdad(fecha: string): number {
    return this.useCase.calcularEdad(fecha);
  }

  async crear(persona: Persona): Promise<boolean> {
    return await this.useCase.insertarPersona(persona);
  }

  async actualizar(persona: Persona): Promise<boolean> {
    return await this.useCase.actualizarPersona(persona);
  }

  async obtener(id: number): Promise<Persona | null> {
    return await this.useCase.obtenerPersona(id);
  }
}