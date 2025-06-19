import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, InfiniteScrollCustomEvent } from '@ionic/angular'; 
import { PokemonService, Pokemon } from '../services/pokemon.service';
import { UiStateService } from '../services/ui-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page implements OnInit, OnDestroy {
  
  public allPokemons: Pokemon[] = [];
  public displayedPokemons: Pokemon[] = [];
  public isOpen = false;
  public isLoading = true;
  private stateSubscription!: Subscription;
  
  private searchTerm: string = '';
  private sortKey: 'id' | 'name' = 'id';

  private offset = 0;

  constructor(
    private pokemonService: PokemonService,
    private uiStateService: UiStateService
  ) {}

  ngOnInit() {
    this.loadPokemons();
    this.stateSubscription = this.uiStateService.isPokedexOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
  }

  togglePokedex() {
    if (this.isOpen) return;
    this.uiStateService.isPokedexOpen$.next(true);
  }

  selectPokemon(pokemon: Pokemon, event: MouseEvent) {
    event.stopPropagation();
    console.log('Pokémon selecionado:', pokemon.name);
  }

  loadPokemons(event?: InfiniteScrollCustomEvent) {

    if (!event) {
      this.isLoading = true;
    }

    this.pokemonService.getPokemonList(this.offset).subscribe(newPokemons => {
      this.allPokemons.push(...newPokemons);
      this.updateDisplayedPokemons();
      this.offset += 25;
      
      this.isLoading = false;

      event?.target.complete();
    });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.loadPokemons(event);
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.updateDisplayedPokemons();
  }

  onSortChange(event: any) {
    this.sortKey = event.detail.value;
    this.updateDisplayedPokemons();
  }

  private updateDisplayedPokemons() {
    let filtered = this.allPokemons.filter(p => 
      p.name.toLowerCase().includes(this.searchTerm) || 
      p.id.toString().includes(this.searchTerm)
    );

    filtered.sort((a, b) => {
      if (this.sortKey === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return parseInt(a.id, 10) - parseInt(b.id, 10);
      }
    });
    
    this.displayedPokemons = filtered;
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}