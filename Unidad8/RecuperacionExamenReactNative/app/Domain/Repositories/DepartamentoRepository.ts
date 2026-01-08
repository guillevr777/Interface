import { Departamento } from "../Entities/Departamento";

export interface DepartamentoRepository {
  getDepartamentos(): Promise<Departamento[]>;
}