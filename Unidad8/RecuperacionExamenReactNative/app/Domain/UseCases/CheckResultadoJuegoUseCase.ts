
import { IntentoDTO } from "../../Application/DTOs/IntentoDTO";
import { ResultadoDTO } from "../../Application/DTOs/ResultadoDTO";
import { ICheckResultadoJuegoUseCase } from "../Interfaces/ICheckResultadoJuegoUseCase";

export class CheckResultadoJuegoUseCase implements ICheckResultadoJuegoUseCase {

    execute(intentos: IntentoDTO[]): ResultadoDTO {
        const total = intentos.length;
        const aciertos = intentos.filter(intento => 
            intento.departamentoSeleccionado === intento.departamentoCorrecto
        ).length;

        const ganador = aciertos === total;

        return new ResultadoDTO(aciertos, total, ganador);
    }
}