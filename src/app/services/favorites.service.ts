import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'pokemonFavorites';

  private favorites$ = new BehaviorSubject<Set<string>>(this.loadFavorites());

  constructor() { }

  private loadFavorites(): Set<string> {
    const favoritesJson = localStorage.getItem(this.STORAGE_KEY);
    return favoritesJson ? new Set(JSON.parse(favoritesJson)) : new Set();
  }

  private saveFavorites(favorites: Set<string>) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(favorites.values())));
    this.favorites$.next(favorites);
  }
  
  getFavorites(): Observable<Set<string>> {
    return this.favorites$.asObservable();
  }

  addFavorite(pokemonId: string) {
    const currentFavorites = this.favorites$.getValue();
    currentFavorites.add(pokemonId);
    this.saveFavorites(currentFavorites);
  }

  removeFavorite(pokemonId: string) {
    const currentFavorites = this.favorites$.getValue();
    currentFavorites.delete(pokemonId);
    this.saveFavorites(currentFavorites);
  }

  isFavorite(pokemonId: string): boolean {
    return this.favorites$.getValue().has(pokemonId);
  }
}