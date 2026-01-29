import { Persona } from '../entities/Persona';
import { IPersonaRepository } from '../repositories/IPersonaRepository';

export class CRUDPersonaUseCase {
  private repository: IPersonaRepository;

  constructor(repository: IPersonaRepository) {
    this.repository = repository;
  }

  async listarPersonas(): Promise<Persona[]> {
    let personas = await this.repository.listar();
    
    // REGLA: Viernes (5) y Sábados (6) solo mayores de 18
    const hoy = new Date().getDay();
    if (hoy === 5 || hoy === 6) {
      personas = personas.filter(p => this.calcularEdad(p.FechaNacimiento) >= 18);
    }
    return personas;
  }

  async eliminarPersona(id: number): Promise<boolean> {
    // REGLA: Domingo (0) no permitido borrar
    if (new Date().getDay() === 0) {
      throw new Error('El domingo no está permitido eliminar a ninguna persona.');
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

  // Lógica de cálculo de edad reutilizable
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