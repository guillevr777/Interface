
import { Departamento } from "../../Domain/Entities/Departamento";
import { DepartamentoRepository } from "../../Domain/Repositories/DepartamentoRepository";
import { API_CONFIG } from "../DataBase/ApiConnection";

const DEPARTAMENTO_COLORS: Record<number, string> = {
  1: "#FF9999", // Ventas - Rojo claro
  2: "#99FF99", // Marketing - Verde claro
  3: "#9999FF", // Finanzas - Azul claro
  4: "#FFFF99", // RRHH - Amarillo claro
  5: "#FF99FF"  // IT - Morado claro
};

export class DepartamentoRepositoryApi implements DepartamentoRepository {
  async getDepartamentos(): Promise<Departamento[]> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/departamentos`);
    if (!response.ok) throw new Error("No se pudo cargar los departamentos");
    
    const data = await response.json();

    return data.map((d: any) => 
      new Departamento(d.id, d.nombre, DEPARTAMENTO_COLORS[d.id] || "#FFFFFF") // Asigna color o blanco por defecto
    );
  }
}