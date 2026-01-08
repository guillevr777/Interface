
import { Persona } from "../Entities/Persona";
import { IGetPersonasUseCase } from "../Interfaces/IPersonaUseCase";
import { PersonaRepository } from "../Repositories/PersonaRepository";

export class GetPersonasUseCase implements IGetPersonasUseCase {
    constructor(private readonly personaRepository: PersonaRepository) {}

    execute(): Promise<Persona[]> {
        return this.personaRepository.getPersonas();
    }
}