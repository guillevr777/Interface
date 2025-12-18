import { Pokemon } from "../entities/Pokemon.js";

export interface IPokemonUseCase {
    mostrarPokemonsPorCantidad(offset: number): Promise<Pokemon[]>;
}