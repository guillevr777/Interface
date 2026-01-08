
import { IntentoDTO } from "../../Application/DTOs/IntentoDTO";
import { ResultadoDTO } from "../../Application/DTOs/ResultadoDTO";

export interface ICheckResultadoJuegoUseCase {
    execute(intentos: IntentoDTO[]): ResultadoDTO;
}