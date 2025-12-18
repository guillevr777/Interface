import { IPokemonRepository } from "../../Domain/repositories/IPokemonRepository";
import { Pokemon } from "../../Domain/entities/Pokemon";
import { PokemonAPI } from "../database/PokemonAPI";

export class PokemonRepository implements IPokemonRepository {
    private api = new PokemonAPI();

    async getPokemonPorCantidad(offset: number): Promise<Pokemon[]> {
        const results = await this.api.fetchPokemons(20, offset);
        
        return results.map((item: any) => {
            // Extraemos el ID de la URL (ej: ".../pokemon/1/")
            const id = parseInt(item.url.split("/").filter(Boolean).pop());
            return new Pokemon(id, item.name);
        });
    }
}