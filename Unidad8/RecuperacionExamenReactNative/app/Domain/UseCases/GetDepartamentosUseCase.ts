
import { Departamento } from "../Entities/Departamento";
import { IGetDepartamentosUseCase } from "../Interfaces/IDepartamentoUseCase";
import { DepartamentoRepository } from "../Repositories/DepartamentoRepository";

export class GetDepartamentosUseCase implements IGetDepartamentosUseCase {
    constructor(private readonly departamentoRepository: DepartamentoRepository) {}

    execute(): Promise<Departamento[]> {
        return this.departamentoRepository.getDepartamentos();
    }
}