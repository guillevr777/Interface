
import { useEffect, useState } from "react";
import { DependencyContainer } from "../../Container/core";
import { Types } from "../../Container/types";

import { IntentoDTO } from "../../Application/DTOs/IntentoDTO";
import { Departamento } from "../../Domain/Entities/Departamento";
import { Persona } from "../../Domain/Entities/Persona";
import { CheckResultadoJuegoUseCase } from "../../Domain/UseCases/CheckResultadoJuegoUseCase";
import { GetDepartamentosUseCase } from "../../Domain/UseCases/GetDepartamentosUseCase";
import { GetPersonasUseCase } from "../../Domain/UseCases/GetPersonasUseCase";


export function useGameViewModel() {
  const getPersonasUC = DependencyContainer.get<GetPersonasUseCase>(Types.GetPersonasUseCase);
  const getDepartamentosUC = DependencyContainer.get<GetDepartamentosUseCase>(Types.GetDepartamentosUseCase);
  const checkResultadoUC = DependencyContainer.get<CheckResultadoJuegoUseCase>(Types.CheckResultadoJuegoUseCase);


  const [personas, setPersonas] = useState<Persona[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [selecciones, setSelecciones] = useState<Record<number, number>>({});
  const [resultado, setResultado] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const depts = await getDepartamentosUC.execute();
        setDepartamentos(depts);

        const allPersonas = await getPersonasUC.execute();
        
        const validPersonas = allPersonas.filter(p => p.departamentoId > 0); 
        
        const shuffled = validPersonas.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        
        setPersonas(selected);

        if (selected.length === 0) {
          setResultado("⚠️ La API no devolvió personas válidas (departamentoId > 0).");
        } else {
            setResultado("");
        }

        const initialSelections: Record<number, number> = {};
        selected.forEach(p => { initialSelections[p.id] = 0; });
        setSelecciones(initialSelections);

      } catch (error) {
        console.error("Error loading game data:", error);
        setResultado("⚠️ Error al cargar datos. Revisa la API o la conexión.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function seleccionarDepartamento(personaId: number, deptId: number | string) { 
    const numericDeptId = parseInt(String(deptId), 10);
    setSelecciones(prev => ({ ...prev, [personaId]: numericDeptId }));
    setResultado("");
  }

  function comprobar() {
    if (personas.length === 0) {
      setResultado("No hay personas para comprobar.");
      return;
    }

    const intentos: IntentoDTO[] = personas.map(p => new IntentoDTO(
      p.id,
      selecciones[p.id] ?? 0,    
      p.departamentoId           
    ));

    const resultadoDTO = checkResultadoUC.execute(intentos);
    
    const { aciertos, total, ganador } = resultadoDTO;

    setResultado(
      ganador
        ? "🎉 ¡Has ganado! Enhorabuena"
        : `❌ Has acertado ${aciertos} de ${total}` 
    );
  }

  return {
    personas,
    departamentos,
    selecciones,
    seleccionarDepartamento,
    comprobar,
    resultado,
    loading,
  };
}