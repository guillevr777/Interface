import { Persona } from '../entities/Persona';
import { IPersonaRepository } from '../repositories/IPersonaRepository';

export class CRUDPersonaUseCase {
  private repository: IPersonaRepository;

  constructor(repository: IPersonaRepository) {
    this.repository = repository;
  }

  async listarPersonas(): Promise<Persona[]> {
    let personas = await this.repository.listar();
    const hoy = new Date().getDay();
    if (hoy === 5 || hoy === 6) {
      personas = personas.filter(p => this.calcularEdad(p.FechaNacimiento) >= 18);
    }
    return personas;
  }

  async eliminarPersona(id: number): Promise<boolean> {
    const hoy = new Date().getDay();
    if (hoy === 0) {
      console.log('Intento de eliminación en domingo bloqueado.');
      return false;
    }
    return await this.repository.eliminar(id);
  }

  async obtenerPersona(id: number): Promise<Persona | null> {
    return await this.repository.obtener(id);
  }

  async insertarPersona(persona: Persona): Promise<boolean> {
    return await this.repository.insertar(persona);
  }

  async actualizarPersona(persona: Persona): Promise<boolean> {
    return await this.repository.actualizar(persona);
  }

  public calcularEdad(fechaNac: string): number {
    const nacimiento = new Date(fechaNac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}