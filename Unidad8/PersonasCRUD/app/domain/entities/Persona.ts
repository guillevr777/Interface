export class Persona {
  ID?: number;
  Nombre: string;
  Apellidos: string;
  Telefono: string;
  Direccion: string;
  FotoURL: string;
  FechaNacimiento: string;
  IDDepartamento: number;
  NombreDepartamento?: string;

  constructor(
    Nombre = '', Apellidos = '', Telefono = '', Direccion = '',
    FotoURL = '', FechaNacimiento = new Date().toISOString(),
    IDDepartamento = 0, ID?: number, NombreDepartamento?: string
  ) {
    this.ID = ID;
    this.Nombre = Nombre;
    this.Apellidos = Apellidos;
    this.Telefono = Telefono;
    this.Direccion = Direccion;
    this.FotoURL = FotoURL;
    this.FechaNacimiento = FechaNacimiento;
    this.IDDepartamento = IDDepartamento;
    this.NombreDepartamento = NombreDepartamento;
  }
}