// src/app/tab2/tab2.page.ts (VERSÃO CORRIGIDA PARA FAVORITOS)

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon, PokemonDetails } from '../models/pokemon.models';
import { UiStateService } from '../services/ui-state.service';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab2Page implements OnInit, OnDestroy {
  public allPokemons: Pokemon[] = [];
  public displayedPokemons: Pokemon[] = [];
  public isOpen = false;
  public isLoading = false;
  private stateSubscription!: Subscription;
  private favoritesSubscription!: Subscription;

  public selectedPokemonDetails: PokemonDetails | null = null;
  public isDetailLoading = false;
  public isCurrentFavorite = false;

  private searchTerm: string = '';
  public sortKey: 'id' | 'name' = 'id';

  constructor(
    private pokemonService: PokemonService,
    private uiStateService: UiStateService,
    private favoritesService: FavoritesService,
  ) {
    addIcons({ heart, 'heart-outline': heartOutline });
  }

  ngOnInit() {
    this.isLoading = true;
    this.favoritesSubscription = this.favoritesService.getFavorites().subscribe(favoriteIds => {
      const ids = Array.from(favoriteIds.values());
      this.loadFavoritePokemons(ids);
    });

    this.stateSubscription = this.uiStateService.isPokedexOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

  loadFavoritePokemons(ids: string[]) {
    if (ids.length === 0) {
      this.allPokemons = [];
      this.updateDisplayedPokemons();
      this.isLoading = false;
      return;
    }

    /*this.pokemonService.getPokemonsByIds(ids).subscribe(favoritePokemons => {
      this.allPokemons = favoritePokemons;
      this.updateDisplayedPokemons();
      this.isLoading = false;
    });*/
  }

  togglePokedex() {
    if (this.isOpen) return;
    this.selectedPokemonDetails = null;
    this.uiStateService.isPokedexOpen$.next(true);
  }

  selectPokemon(pokemon: Pokemon, event: MouseEvent) {
    event.stopPropagation();
    this.isDetailLoading = true;
    this.selectedPokemonDetails = null;
    this.pokemonService.getPokemonDetails(pokemon.id).subscribe(details => {
      this.selectedPokemonDetails = details;
      this.isDetailLoading = false;
      this.isCurrentFavorite = this.favoritesService.isFavorite(details.id.toString());
    });
  }

  onSearchChange(event: any) { this.searchTerm = event.detail.value.toLowerCase(); this.updateDisplayedPokemons(); }
  onSortChange(event: any) { this.sortKey = event.detail.value; this.updateDisplayedPokemons(); }
  
  private updateDisplayedPokemons() {
    let filtered = this.allPokemons.filter(p => p.name.toLowerCase().includes(this.searchTerm) || p.id.toString().includes(this.searchTerm));
    filtered.sort((a, b) => {
      if (this.sortKey === 'name') { return a.name.localeCompare(b.name); } 
      else { return parseInt(a.id, 10) - parseInt(b.id, 10); }
    });
    this.displayedPokemons = filtered;
  }

  toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    if (!this.selectedPokemonDetails) return;
    const id = this.selectedPokemonDetails.id.toString();
    if (this.isCurrentFavorite) { this.favoritesService.removeFavorite(id); } 
    else { this.favoritesService.addFavorite(id); }
  }

  trackByPokemon(index: number, pokemon: Pokemon): string { return pokemon.id; }
  public getPokemonsToDisplay(): Pokemon[] { return this.displayedPokemons; }

  ngOnDestroy() {
    if (this.stateSubscription) { this.stateSubscription.unsubscribe(); }
    if (this.favoritesSubscription) { this.favoritesSubscription.unsubscribe(); }
  }
}