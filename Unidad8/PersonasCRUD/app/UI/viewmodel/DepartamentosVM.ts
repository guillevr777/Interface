import Container from '../../container/core';
import { IViewModel } from '../../container/types';
import { Departamento } from '../../domain/entities/Departamento';

export class CRUDDepartamentoVM implements IViewModel<Departamento> {
  private useCase;

  constructor() {
    // Obtener el caso de uso desde el contenedor
    this.useCase = Container.getInstance().getCRUDDepartamentosUseCase();
  }

  /**
   * Obtiene la lista completa de departamentos
   * @returns Promise con array de Departamentos
   */
  async listar(): Promise<Departamento[]> {
    try {
      return await this.useCase.listarDepartamentos();
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.listar:', error);
      throw error;
    }
  }

  /**
   * Obtiene un departamento por su ID
   * @param id - ID del departamento a obtener
   * @returns Promise con el Departamento o null si no existe
   */
  async obtener(id: number): Promise<Departamento | null> {
    try {
      return await this.useCase.editarDepartamento(id);
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.obtener:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo departamento
   * @param departamento - Datos del departamento a crear
   * @returns Promise<boolean> - true si se creó correctamente
   */
  async crear(departamento: Departamento): Promise<boolean> {
    try {
      // Validación antes de crear
      this.validarDepartamento(departamento);
      return await this.useCase.insertarDepartamento(departamento);
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.crear:', error);
      throw error;
    }
  }

  /**
   * Actualiza un departamento existente
   * @param departamento - Datos del departamento a actualizar
   * @returns Promise<boolean> - true si se actualizó correctamente
   */
  async actualizar(departamento: Departamento): Promise<boolean> {
    try {
      // Validación antes de actualizar
      this.validarDepartamento(departamento);
      return await this.useCase.actualizarDepartamento(departamento);
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.actualizar:', error);
      throw error;
    }
  }

  /**
   * Elimina un departamento por su ID
   * @param id - ID del departamento a eliminar
   * @returns Promise<boolean> - true si se eliminó correctamente
   */
  async eliminar(id: number): Promise<boolean> {
    try {
      if (id <= 0) {
        throw new Error('ID inválido');
      }
      
      // Verificar si hay personas asociadas
      const tienePersonas = await this.verificarPersonasAsociadas(id);
      if (tienePersonas) {
        throw new Error('No se puede eliminar el departamento porque tiene personas asociadas');
      }
      
      return await this.useCase.eliminarDepartamento(id);
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.eliminar:', error);
      throw error;
    }
  }

  /**
   * Valida los datos de un departamento antes de guardar
   * @param departamento - Departamento a validar
   * @throws Error si la validación falla
   */
  private validarDepartamento(departamento: Departamento): void {
    if (!departamento.nombre || departamento.nombre.trim().length === 0) {
      throw new Error('El nombre del departamento es obligatorio');
    }

    if (departamento.nombre.length < 2 || departamento.nombre.length > 100) {
      throw new Error('El nombre del departamento debe tener entre 2 y 100 caracteres');
    }
  }

  /**
   * Verifica si un departamento tiene personas asociadas
   * @param idDepartamento - ID del departamento a verificar
   * @returns Promise<boolean> - true si tiene personas asociadas
   */
  private async verificarPersonasAsociadas(idDepartamento: number): Promise<boolean> {
    try {
      // Obtener el ViewModel de personas desde el contenedor
      const personaVM = Container.getInstance().getCRUDPersonasUseCase();
      const personas = await personaVM.listarPersonas();
      
      return personas.some(persona => persona.idDepartamento === idDepartamento);
    } catch (error) {
      console.error('Error al verificar personas asociadas:', error);
      return false;
    }
  }

  /**
   * Busca departamentos por nombre
   * @param termino - Término de búsqueda
   * @returns Promise con array de Departamentos que coinciden
   */
  async buscarPorNombre(termino: string): Promise<Departamento[]> {
    try {
      const todosDepartamentos = await this.listar();
      const terminoLower = termino.toLowerCase().trim();
      
      return todosDepartamentos.filter(departamento => 
        departamento.nombre.toLowerCase().includes(terminoLower)
      );
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.buscarPorNombre:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de un departamento
   * @param idDepartamento - ID del departamento
   * @returns Promise con objeto de estadísticas
   */
  async obtenerEstadisticas(idDepartamento: number): Promise<{
    totalPersonas: number;
    edadPromedio: number;
  }> {
    try {
      const personaVM = Container.getInstance().getCRUDPersonasUseCase();
      const personas = await personaVM.listarPersonas();
      const personasDept = personas.filter(p => p.idDepartamento === idDepartamento);
      
      const totalPersonas = personasDept.length;
      const edadPromedio = totalPersonas > 0
        ? personasDept.reduce((sum, p) => sum + p.edad, 0) / totalPersonas
        : 0;
      
      return {
        totalPersonas,
        edadPromedio: Math.round(edadPromedio * 10) / 10 // Redondear a 1 decimal
      };
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.obtenerEstadisticas:', error);
      return { totalPersonas: 0, edadPromedio: 0 };
    }
  }

  /**
   * Verifica si existe un departamento con el mismo nombre
   * @param nombre - Nombre a verificar
   * @param idExcluir - ID a excluir de la búsqueda (para edición)
   * @returns Promise<boolean> - true si existe
   */
  async existeNombre(nombre: string, idExcluir?: number): Promise<boolean> {
    try {
      const departamentos = await this.listar();
      const nombreLower = nombre.toLowerCase().trim();
      
      return departamentos.some(dept => 
        dept.nombre.toLowerCase().trim() === nombreLower && 
        dept.id !== idExcluir
      );
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.existeNombre:', error);
      return false;
    }
  }
}