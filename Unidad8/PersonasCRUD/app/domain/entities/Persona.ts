export class Persona {
  id: number;
  nombre: string;
  apellidos: string;
  edad: number;
  idDepartamento: number;

  constructor(
    id: number = 0,
    nombre: string = '',
    apellidos: string = '',
    edad: number = 0,
    idDepartamento: number = 0
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.edad = edad;
    this.idDepartamento = idDepartamento;
  }
}