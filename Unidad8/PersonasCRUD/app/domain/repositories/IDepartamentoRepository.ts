import { Departamento } from '../entities/Departamento';

export interface IDepartamentoRepository {
  listar(): Promise<Departamento[]>;
  editar(id: number): Promise<Departamento | null>;
  insertar(departamento: Departamento): Promise<boolean>;
  actualizar(departamento: Departamento): Promise<boolean>;
  eliminar(id: number): Promise<boolean>;
}