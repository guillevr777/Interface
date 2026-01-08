export class ResultadoDTO {
  constructor(
    public aciertos: number,
    public total: number,
    public ganador: boolean
  ) {}
}