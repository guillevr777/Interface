import Container from '../../container/core';
import { IViewModel } from '../../container/types';
import { Persona } from '../../domain/entities/Persona';

export class CRUDPersonaVM implements IViewModel<Persona> {
  private useCase;

  constructor() {
    // Obtener el caso de uso desde el contenedor
    this.useCase = Container.getInstance().getCRUDPersonasUseCase();
  }

  /**
   * Obtiene la lista completa de personas
   * @returns Promise con array de Personas
   */
  async listar(): Promise<Persona[]> {
    try {
      return await this.useCase.listarPersonas();
    } catch (error) {
      console.error('Error en CRUDPersonaVM.listar:', error);
      throw error;
    }
  }

  /**
   * Obtiene una persona por su ID
   * @param id - ID de la persona a obtener
   * @returns Promise con la Persona o null si no existe
   */
  async obtener(id: number): Promise<Persona | null> {
    try {
      return await this.useCase.editarPersona(id);
    } catch (error) {
      console.error('Error en CRUDPersonaVM.obtener:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva persona
   * @param persona - Datos de la persona a crear
   * @returns Promise<boolean> - true si se creó correctamente
   */
  async crear(persona: Persona): Promise<boolean> {
    try {
      // Validación antes de crear
      this.validarPersona(persona);
      return await this.useCase.insertarPersona(persona);
    } catch (error) {
      console.error('Error en CRUDPersonaVM.crear:', error);
      throw error;
    }
  }

  /**
   * Actualiza una persona existente
   * @param persona - Datos de la persona a actualizar
   * @returns Promise<boolean> - true si se actualizó correctamente
   */
  async actualizar(persona: Persona): Promise<boolean> {
    try {
      // Validación antes de actualizar
      this.validarPersona(persona);
      return await this.useCase.actualizarPersona(persona);
    } catch (error) {
      console.error('Error en CRUDPersonaVM.actualizar:', error);
      throw error;
    }
  }

  /**
   * Elimina una persona por su ID
   * @param id - ID de la persona a eliminar
   * @returns Promise<boolean> - true si se eliminó correctamente
   */
  async eliminar(id: number): Promise<boolean> {
    try {
      if (id <= 0) {
        throw new Error('ID inválido');
      }
      return await this.useCase.eliminarPersona(id);
    } catch (error) {
      console.error('Error en CRUDPersonaVM.eliminar:', error);
      throw error;
    }
  }

  /**
   * Valida los datos de una persona antes de guardar
   * @param persona - Persona a validar
   * @throws Error si la validación falla
   */
  private validarPersona(persona: Persona): void {
    if (!persona.nombre || persona.nombre.trim().length === 0) {
      throw new Error('El nombre es obligatorio');
    }

    if (!persona.apellidos || persona.apellidos.trim().length === 0) {
      throw new Error('Los apellidos son obligatorios');
    }

    if (persona.nombre.length < 2 || persona.nombre.length > 50) {
      throw new Error('El nombre debe tener entre 2 y 50 caracteres');
    }

    if (persona.apellidos.length < 2 || persona.apellidos.length > 50) {
      throw new Error('Los apellidos deben tener entre 2 y 50 caracteres');
    }

    if (persona.edad < 0 || persona.edad > 120) {
      throw new Error('La edad debe estar entre 0 y 120 años');
    }

    if (persona.idDepartamento <= 0) {
      throw new Error('Debe seleccionar un departamento válido');
    }
  }

  /**
   * Busca personas por nombre o apellidos
   * @param termino - Término de búsqueda
   * @returns Promise con array de Personas que coinciden
   */
  async buscarPorNombre(termino: string): Promise<Persona[]> {
    try {
      const todasPersonas = await this.listar();
      const terminoLower = termino.toLowerCase().trim();
      
      return todasPersonas.filter(persona => 
        persona.nombre.toLowerCase().includes(terminoLower) ||
        persona.apellidos.toLowerCase().includes(terminoLower)
      );
    } catch (error) {
      console.error('Error en CRUDPersonaVM.buscarPorNombre:', error);
      throw error;
    }
  }

  /**
   * Obtiene personas por departamento
   * @param idDepartamento - ID del departamento
   * @returns Promise con array de Personas del departamento
   */
  async obtenerPorDepartamento(idDepartamento: number): Promise<Persona[]> {
    try {
      const todasPersonas = await this.listar();
      return todasPersonas.filter(persona => 
        persona.idDepartamento === idDepartamento
      );
    } catch (error) {
      console.error('Error en CRUDPersonaVM.obtenerPorDepartamento:', error);
      throw error;
    }
  }
}