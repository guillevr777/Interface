import { IPokemonUseCase } from "../interfaces/IPokemonUseCase";
import { IPokemonRepository } from "../repositories/IPokemonRepository";
import { Pokemon } from "../entities/Pokemon";

export class PokemonUseCase implements IPokemonUseCase {
    // Inyectamos el repositorio
    constructor(private pokemonRepository: IPokemonRepository) {}

    async mostrarPokemonsPorCantidad(offset: number): Promise<Pokemon[]> {
        return await this.pokemonRepository.getPokemonPorCantidad(offset);
    }
}