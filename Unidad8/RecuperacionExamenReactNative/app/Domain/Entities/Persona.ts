export class Persona {
  constructor(
    public id: number,
    public nombre: string,
    public apellidos: string,
    public departamentoId: number // ID del departamento real (Correcto)
  ) {}
}