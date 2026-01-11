import { Departamento } from '../entities/Departamento';

export interface ICRUDDepartamentosUseCase {
  listarDepartamentos(): Promise<Departamento[]>;
  obtenerDepartamentoPorId(id: number): Promise<Departamento>;
  insertarDepartamento(departamento: Departamento): Promise<boolean>;
  actualizarDepartamento(departamento: Departamento): Promise<boolean>;
  eliminarDepartamento(id: number): Promise<boolean>;
}