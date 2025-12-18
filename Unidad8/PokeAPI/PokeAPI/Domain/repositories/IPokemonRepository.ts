import { Pokemon } from "../entities/Pokemon.js";

export interface IPokemonRepository {
    getPokemonPorCantidad(offset: number): Promise<Pokemon[]>;
}