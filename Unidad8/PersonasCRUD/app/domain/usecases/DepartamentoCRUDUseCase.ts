import { Departamento } from '../entities/Departamento';
import { IDepartamentoRepository } from '../repositories/IDepartamentoRepository';

export class CRUDDepartamentosUseCase {
  constructor(private repository: IDepartamentoRepository) {}

  async listarDepartamentos(): Promise<Departamento[]> {
    return await this.repository.listar();
  }

  async editarDepartamento(id: number): Promise<Departamento | null> {
    return await this.repository.editar(id);
  }

  async insertarDepartamento(departamento: Departamento): Promise<boolean> {
    return await this.repository.insertar(departamento);
  }

  async actualizarDepartamento(departamento: Departamento): Promise<boolean> {
    return await this.repository.actualizar(departamento);
  }

  async eliminarDepartamento(id: number): Promise<boolean> {
    return await this.repository.eliminar(id);
  }
}