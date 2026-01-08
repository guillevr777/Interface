
import { Persona } from "../Entities/Persona";

export interface IGetPersonasUseCase {
    execute(): Promise<Persona[]>;
}