// src/app/services/pokemon.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface para a resposta da API
export interface PokemonListResponse {
  count: number;
  next: string;
  previous: string | null;
  results: { name: string; url: string }[];
}

// Interface para o nosso objeto Pokémon já tratado
export interface Pokemon {
  name: string;
  url: string;
  id: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private imageUrlBase = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  constructor(private http: HttpClient) { }

  getPokemonList(offset: number = 0, limit: number = 25): Observable<Pokemon[]> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`)
      .pipe(
        map(response => {
          return response.results.map(p => {
            // Extrai o ID da URL (ex: .../pokemon/1/ -> "1")
            const id = p.url.split('/').filter(Boolean).pop()!;
            return {
              ...p,
              id: id,
              // Monta a URL da imagem com o ID
              imageUrl: `${this.imageUrlBase}${id}.png`
            };
          });
        })
      );
  }
}