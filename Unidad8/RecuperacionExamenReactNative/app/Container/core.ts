
import { DepartamentoRepositoryApi } from "../Data/Repositories/DepartamentoRepository";
import { PersonaRepositoryApi } from "../Data/Repositories/PersonaRepository";

import { CheckResultadoJuegoUseCase } from "../Domain/UseCases/CheckResultadoJuegoUseCase";
import { GetDepartamentosUseCase } from "../Domain/UseCases/GetDepartamentosUseCase";
import { GetPersonasUseCase } from "../Domain/UseCases/GetPersonasUseCase";
import { Types } from "./types";


const registry: Map<symbol, any> = new Map();

export const DependencyContainer = {
    register: (type: symbol, implementation: any) => registry.set(type, implementation),
    get: <T>(type: symbol): T => {
        const impl = registry.get(type);
        if (!impl) {
            const errorMsg = `FATAL: Dependencia no encontrada: ${type.toString()}.`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        return impl as T;
    }
};


const personaRepo = new PersonaRepositoryApi();
const departamentoRepo = new DepartamentoRepositoryApi();

const getPersonasUC = new GetPersonasUseCase(personaRepo);
const getDepartamentosUC = new GetDepartamentosUseCase(departamentoRepo);
const checkResultadoUC = new CheckResultadoJuegoUseCase();

DependencyContainer.register(Types.IPersonaRepository, personaRepo);
DependencyContainer.register(Types.IDepartamentoRepository, departamentoRepo);

DependencyContainer.register(Types.GetPersonasUseCase, getPersonasUC);
DependencyContainer.register(Types.GetDepartamentosUseCase, getDepartamentosUC);
DependencyContainer.register(Types.CheckResultadoJuegoUseCase, checkResultadoUC);

console.log("✅ Dependencias registradas y listas para usar.");