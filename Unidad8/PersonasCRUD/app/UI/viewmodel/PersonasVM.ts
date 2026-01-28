import Container from '../../container/core';
import { IDepartamento, IViewModel } from '../../container/types';
import { Persona } from '../../domain/entities/Persona';

export class CRUDPersonaVM implements IViewModel<Persona> {
  private useCase;
  private deptoUseCase; // Nuevo

  personas: Persona[] = [];
  departamentos: IDepartamento[] = []; // Para el dropdown
  personaActual: Persona | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    this.useCase = Container.getInstance().getCRUDPersonasUseCase();
    this.deptoUseCase = Container.getInstance().getCRUDDepartamentosUseCase();
  }

  // Carga la lista de departamentos para el selector
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
    try {
      let personas = await this.useCase.listarPersonas();
      const hoy = new Date().getDay();
      if (hoy === 5 || hoy === 6) {
        personas = personas.filter(p => this.calcularEdad(p.FechaNacimiento) > 18);
      }
      this.personas = personas;
      return personas;
    } catch {
      return [];
    } finally {
      this.loading = false;
    }
  }

  async obtener(id: number): Promise<Persona | null> {
    return await this.useCase.obtenerPersona(id);
  }

  async crear(persona: Persona): Promise<boolean> {
    const error = this.validar(persona);
    if (error) { this.error = error; return false; }
    return await this.useCase.insertarPersona(persona);
  }

  async actualizar(persona: Persona): Promise<boolean> {
    const error = this.validar(persona);
    if (error) { this.error = error; return false; }
    return await this.useCase.actualizarPersona(persona);
  }

  async eliminar(id: number): Promise<boolean> {
    if (new Date().getDay() === 0) {
      this.error = 'No se puede eliminar en domingo';
      return false;
    }
    return await this.useCase.eliminarPersona(id);
  }

  private validar(persona: Persona): string | null {
    if (!persona.Nombre || !persona.Apellidos) return 'Nombre y apellidos obligatorios';
    if (!persona.IDDepartamento || persona.IDDepartamento === 0) return 'Seleccione un departamento';
    return null;
  }

  private calcularEdad(fecha: string): number {
    const nac = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }
}