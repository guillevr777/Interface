export class PokemonAPI {
    private readonly BASE_URL = "https://pokeapi.co/api/v2/pokemon";

    async fetchPokemons(limit: number, offset: number) {
        const response = await fetch(`${this.BASE_URL}?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        return data.results; // Retorna [{name: "...", url: "..."}]
    }
}