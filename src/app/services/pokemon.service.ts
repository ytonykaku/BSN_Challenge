
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PokemonListResponse {
  count: number;
  next: string;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = 'https://pokeapi.co/api/v2';

  // Injetamos o HttpClient para poder fazer chamadas de rede
  constructor(private http: HttpClient) { }

  // Nosso primeiro método para buscar a lista de Pokémon
  getPokemonList(offset: number = 0, limit: number = 25): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`);
  }
}