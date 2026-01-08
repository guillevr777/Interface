
import { Departamento } from "../Entities/Departamento";

export interface IGetDepartamentosUseCase {
    execute(): Promise<Departamento[]>;
}