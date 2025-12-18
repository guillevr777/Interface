import { PokemonRepository } from "../Data/repositories/PokemonRepository";
import { PokemonUseCase } from "../Domain/usecases/PokemonUseCase";
import { IPokemonUseCase } from "../Domain/interfaces/IPokemonUseCase";
import { IPokemonRepository } from "../Domain/repositories/IPokemonRepository";

// 1. Instanciamos el Repositorio (Capa de Datos)
// Se asigna a la interfaz para desacoplar el origen de datos
const pokemonRepo: IPokemonRepository = new PokemonRepository();

// 2. Instanciamos el Caso de Uso (Capa de Dominio)
// Le inyectamos su dependencia necesaria (el repositorio)
const pokemonUseCaseInstance: IPokemonUseCase = new PokemonUseCase(pokemonRepo);

// 3. Exportamos la instancia única (Singleton) que usará el ViewModel
export { pokemonUseCaseInstance as pokemonUseCase };