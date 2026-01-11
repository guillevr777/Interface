import { DepartamentoRepository } from '../data/repositories/DepartamentosRepository';
import { PersonasRepository } from '../data/repositories/PersonasRepository';
import { CRUDDepartamentosUseCase } from '../domain/usecases/DepartamentoCRUDUseCase';
import { CRUDPersonaUseCase } from '../domain/usecases/PersonaCRUDUseCase';

class Container {
  private static instance: Container;

  private personasRepository: PersonasRepository;
  private departamentoRepository: DepartamentoRepository;

  private crudPersonasUseCase: CRUDPersonaUseCase;
  private crudDepartamentosUseCase: CRUDDepartamentosUseCase;

  private constructor() {
    this.personasRepository = new PersonasRepository();
    this.departamentoRepository = new DepartamentoRepository();

    this.crudPersonasUseCase = new CRUDPersonaUseCase(this.personasRepository);
    this.crudDepartamentosUseCase = new CRUDDepartamentosUseCase(this.departamentoRepository);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getCRUDPersonasUseCase(): CRUDPersonaUseCase {
    return this.crudPersonasUseCase;
  }

  public getCRUDDepartamentosUseCase(): CRUDDepartamentosUseCase {
    return this.crudDepartamentosUseCase;
  }
}

export default Container;
