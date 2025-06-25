import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  Pokemon,
  PokemonDetails,
  PokemonListResponse,
  PokemonSpecies,
} from '../models/pokemon.models';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private imageUrlBase =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  private detailsCache = new Map<string, PokemonDetails>();

  constructor(private http: HttpClient) {}

  private transformToPokemon(pokemonData: any): Pokemon {
    const id = pokemonData.id.toString();
    return {
      id: id,
      name: pokemonData.name,
      url: `${this.baseUrl}/pokemon/${id}/`,
      imageUrl: `${this.imageUrlBase}${id}.png`,
    };
  }

  getPokemonList(offset: number = 0, limit: number = 25): Observable<Pokemon[]> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`)
      .pipe(
        map((response) =>
          response.results.map((p) => {
            const id = p.url.split('/').filter(Boolean).pop()!;
            return {
              name: p.name,
              url: p.url,
              id: id,
              imageUrl: `${this.imageUrlBase}${id}.png`,
            };
          }),
        ),
        catchError((error) => {
          console.error('Erro ao buscar a lista de Pokémon:', error);
          return of([]);
        }),
      );
  }

  getPokemonDetails(id: string): Observable<PokemonDetails> {
    if (this.detailsCache.has(id)) {
      return of(this.detailsCache.get(id)!);
    }

    const details$ = this.http.get<any>(`${this.baseUrl}/pokemon/${id}`);
    const species$ = this.http.get<PokemonSpecies>(`${this.baseUrl}/pokemon-species/${id}`);

    return forkJoin([details$, species$]).pipe(
      map(([details, species]) => {
        const descriptionEntry = species.flavor_text_entries.find(
          (entry) => entry.language.name === 'en',
        );
        const description = descriptionEntry
          ? descriptionEntry.flavor_text.replace(/[\n\f]/g, ' ')
          : 'Nenhuma descrição encontrada.';

        const combinedDetails: PokemonDetails = { ...details, description: description };
        return combinedDetails;
      }),
      tap((combinedDetails) => {
        this.detailsCache.set(id, combinedDetails);
      }),
      catchError((error) => {
        console.error(`Erro ao buscar detalhes do Pokémon ${id}:`, error);
        return throwError(() => new Error('Não foi possível carregar os detalhes do Pokémon.'));
      }),
    );
  }

  getPokemonsByIds(ids: string[]): Observable<Pokemon[]> {
    if (ids.length === 0) {
      return of([]);
    }

    const requests = ids.map((id) =>
      this.http.get<any>(`${this.baseUrl}/pokemon/${id}`).pipe(
        map((detail) => this.transformToPokemon(detail)),
        catchError((error) => {
          console.error(`Erro ao buscar Pokémon ${id}:`, error);
          return of(null);
        }),
      ),
    );

    return forkJoin(requests).pipe(
      map((pokemons) => pokemons.filter((pokemon) => pokemon !== null)),
      catchError((error) => {
        console.error('Erro ao buscar múltiplos Pokémon:', error);
        return of([]);
      }),
    );
  }
}
