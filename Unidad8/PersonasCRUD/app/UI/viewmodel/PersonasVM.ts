import Container from '../../container/core';
import { IViewModel } from '../../container/types';
import { Persona } from '../../domain/entities/Persona';

export class CRUDPersonaVM implements IViewModel<Persona> {
  private useCase;

  personas: Persona[] = [];
  personaActual: Persona | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    this.useCase = Container.getInstance().getCRUDPersonasUseCase();
  }

  async listar(): Promise<Persona[]> {
  this.loading = true;
  this.error = null;

  try {
    let personas = await this.useCase.listarPersonas();

    const hoy = new Date().getDay();
    // Filtrar mayores de 18 solo viernes (5) y sábado (6)
    if (hoy === 5 || hoy === 6) {
      personas = personas.filter(p => this.calcularEdad(p.FechaNacimiento) > 18);
    }

    this.personas = personas;
    return personas;
  } catch {
    this.error = 'No se pudieron cargar las personas';
    return [];
  } finally {
    this.loading = false;
  }
}



  async obtener(id: number): Promise<Persona | null> {
    this.loading = true;
    this.error = null;

    try {
      this.personaActual = await this.useCase.obtenerPersona(id);
      return this.personaActual;
    } catch {
      this.error = 'No se pudo obtener la persona';
      return null;
    } finally {
      this.loading = false;
    }
  }

  async crear(persona: Persona): Promise<boolean> {
    const error = this.validar(persona);
    if (error) {
      this.error = error;
      return false;
    }

    const { ID, ...data } = persona;

    try {
      const success = await this.useCase.insertarPersona(data as Persona);
      if (success) await this.listar();
      return success;
    } catch {
      this.error = 'Error al crear la persona';
      return false;
    }
  }

  async actualizar(persona: Persona): Promise<boolean> {
    const error = this.validar(persona);
    if (error) {
      this.error = error;
      return false;
    }

    try {
      const success = await this.useCase.actualizarPersona(persona);
      if (success) await this.listar();
      return success;
    } catch {
      this.error = 'Error al actualizar la persona';
      return false;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    const hoy = new Date().getDay();

    // 0 = domingo
    if (hoy === 0) {
      this.error = 'Los domingos no está permitido eliminar personas';
      return false;
    }

    try {
      const success = await this.useCase.eliminarPersona(id);
      if (success) await this.listar();
      return success;
    } catch {
      this.error = 'Error al eliminar la persona';
      return false;
    }
  }


  private validar(persona: Persona): string | null {
    if (!persona.Nombre || !persona.Apellidos) {
      return 'Nombre y apellidos son obligatorios';
    }

    if (!persona.IDDepartamento || persona.IDDepartamento === 0) {
      return 'Debe seleccionar un departamento';
    }

    return null;
  }

  private calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - nacimiento.getMonth();
    const diaDiff = hoy.getDate() - nacimiento.getDate();

    if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
      edad--;
    }

    return edad;
  }
}
