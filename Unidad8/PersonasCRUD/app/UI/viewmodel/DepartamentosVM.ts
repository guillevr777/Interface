import Container from '../../container/core';
import { IViewModel } from '../../container/types';
import { Departamento } from '../../domain/entities/Departamento';

export class CRUDDepartamentoVM implements IViewModel<Departamento> {
  private useCase;

  constructor() {
    this.useCase = Container.getInstance().getCRUDDepartamentosUseCase();
  }

  async listar(): Promise<Departamento[]> {
    try {
      return await this.useCase.listarDepartamentos();
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.listar:', error);
      throw error;
    }
  }

  async obtener(id: number): Promise<Departamento | null> {
    try {
      return await this.useCase.editarDepartamento(id);
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.obtener:', error);
      throw error;
    }
  }

  async crear(depto: Departamento): Promise<boolean> {
    try {
      this.validarDepartamento(depto);
      return await this.useCase.insertarDepartamento(depto);
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.crear:', error);
      throw error;
    }
  }

  async actualizar(depto: Departamento): Promise<boolean> {
    try {
      this.validarDepartamento(depto);
      return await this.useCase.actualizarDepartamento(depto);
    } catch (error) {
      console.error('Error en CRUDDepartamentoVM.actualizar:', error);
      throw error;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      if (id <= 0) throw new Error('ID inválido');
      
      // Verificación de integridad referencial manual
      const tienePersonas = await this.verificarPersonasAsociadas(id);
      if (tienePersonas) {
        // Lanzamos el error específico que la vista capturará
        throw new Error('El departamento tiene personas asociadas');
      }
      
      return await this.useCase.eliminarDepartamento(id);
    } catch (error) {
      // Re-lanzamos el error para que la UI lo maneje
      throw error;
    }
  }

  private validarDepartamento(depto: Departamento) {
    if (!depto.nombre || depto.nombre.trim().length === 0)
      throw new Error('El nombre del departamento es obligatorio');
    if (depto.nombre.length < 2 || depto.nombre.length > 100)
      throw new Error('El nombre del departamento debe tener entre 2 y 100 caracteres');
  }

  private async verificarPersonasAsociadas(idDepartamento: number): Promise<boolean> {
    try {
      const personaUseCase = Container.getInstance().getCRUDPersonasUseCase();
      const personas = await personaUseCase.listarPersonas();
      return personas.some(p => p.IDDepartamento === idDepartamento);
    } catch (error) {
      console.error('Error al verificar personas asociadas:', error);
      return false;
    }
  }
}