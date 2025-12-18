import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { usePokemonViewModel } from '../UI/Controllers/PokemonVM';

export default function PokeView() {
    const { pokemons, isLoading, error, handleLoadMore } = usePokemonViewModel();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Pokédex Explorer</Text>
            
            {error && <Text style={styles.errorText}>{error}</Text>}

            <View style={styles.grid}>
                {pokemons.map((pokemon) => (
                    <View key={pokemon.id} style={styles.card}>
                        <Image 
                            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }} 
                            style={styles.image} 
                        />
                        <Text style={styles.pokemonName}>
                            #{pokemon.id} - {pokemon.nombre.toUpperCase()}
                        </Text>
                    </View>
                ))}
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#ef5350" style={{ marginVertical: 20 }} />
            ) : (
                <TouchableOpacity 
                    onPress={handleLoadMore} 
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Cargar Siguientes 20</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { paddingVertical: 40, alignItems: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15 },
    card: { backgroundColor: 'white', borderRadius: 12, padding: 10, width: 140, alignItems: 'center', elevation: 2 },
    image: { width: 90, height: 90 },
    pokemonName: { fontSize: 13, fontWeight: 'bold', marginTop: 5, textAlign: 'center' },
    button: { marginTop: 30, backgroundColor: '#ef5350', padding: 15, borderRadius: 25, width: '70%', alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    errorText: { color: 'red', marginBottom: 10 }
});