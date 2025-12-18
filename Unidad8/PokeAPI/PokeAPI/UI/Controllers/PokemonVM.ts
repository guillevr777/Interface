import { useState } from "react";
import { Pokemon } from "../../Domain/entities/Pokemon";
import { pokemonUseCase } from "../../Container/DI";

export const usePokemonViewModel = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLoadMore = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            // Obtenemos los 20 Pokémon correspondientes al offset actual
            const nuevosPokemons = await pokemonUseCase.mostrarPokemonsPorCantidad(offset);
            
            // CAMBIO CLAVE: Reemplazamos la lista en lugar de acumularla
            setPokemons(nuevosPokemons);
            
            // Incrementamos el offset en 20 para la próxima página
            setOffset(prevOffset => prevOffset + 20);
            
        } catch (err) {
            setError("Error al conectar con la PokeAPI.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        pokemons,
        isLoading,
        error,
        handleLoadMore
    };
};