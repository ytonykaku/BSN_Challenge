import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonContent } from '@ionic/angular';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon, PokemonDetails } from '../models/pokemon.models';
import { UiStateService } from '../services/ui-state.service';
import { FavoritesService } from '../services/favorites.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') content!: ElementRef;
  
  // State variables
  public allPokemons: Pokemon[] = [];
  public displayedPokemons: Pokemon[] = [];
  public isOpen = false;
  public isLoading = true;
  public selectedPokemonDetails: PokemonDetails | null = null;
  public isDetailLoading = false;
  public isCurrentFavorite = false;

  private generationRanges = [
    { start: 1, end: 151 },     // Gen 1
    { start: 152, end: 251 },   // Gen 2
    { start: 252, end: 386 },   // Gen 3
    { start: 387, end: 493 },   // Gen 4
    { start: 494, end: 649 },   // Gen 5
    { start: 650, end: 721 },   // Gen 6
    { start: 722, end: 809 },   // Gen 7
    { start: 810, end: 905 },   // Gen 8
    { start: 906, end: 1010 }   // Gen 9
  ];
  private currentGenIndex = 0;
  private nextPokemonId = 1;
  private batchSize = 20;
  private currentGenMax = 151;

  // Subscriptions
  private stateSubscription!: Subscription;
  private favoritesSubscription!: Subscription;

  // Filtering and Sorting
  private searchTerm: string = '';
  public sortKey: 'id' | 'name' = 'id';

  constructor(
    private pokemonService: PokemonService,
    private uiStateService: UiStateService,
    private favoritesService: FavoritesService,
  ) {
    // Register icons for the favorite button
    addIcons({ heart, 'heart-outline': heartOutline });
  }

  ngOnInit() {
    console.log('Tab1Page initialized');
    this.loadNextGeneration();

    this.stateSubscription = this.uiStateService.isPokedexOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });

    this.favoritesSubscription = this.favoritesService.getFavorites().subscribe(favIds => {
      if (this.selectedPokemonDetails) {
        this.isCurrentFavorite = favIds.has(this.selectedPokemonDetails.id.toString());
      }
    });
}

  // --- Core Logic Methods ---

  selectPokemon(pokemon: Pokemon, event: MouseEvent) {
    event.stopPropagation();
    if (this.isDetailLoading) return;

    this.isDetailLoading = true;
    this.selectedPokemonDetails = null;

    this.pokemonService.getPokemonDetails(pokemon.id).subscribe(details => {
      this.selectedPokemonDetails = details;
      this.isDetailLoading = false;
      this.isCurrentFavorite = this.favoritesService.isFavorite(details.id.toString());
    });
  }

  // --- UI Event Handlers ---

  togglePokedex() {
    if (this.isOpen) return;
    this.uiStateService.isPokedexOpen$.next(true);
    setTimeout(() => this.checkScroll(), 500);
    this.searchTerm = '';
    this.updateDisplayedPokemons();
  }

  onScroll(event: Event) {
    if (this.isLoading) return;

    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const clientHeight = target.clientHeight;
    const scrollHeight = target.scrollHeight;

    if ((scrollTop + clientHeight) / scrollHeight >= 0.5) {
      this.loadNextGeneration();
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.updateDisplayedPokemons();
  }

  onSortChange(event: any) {
    this.sortKey = event.detail.value;
    this.updateDisplayedPokemons();
  }

  toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    if (!this.selectedPokemonDetails) return;

    const id = this.selectedPokemonDetails.id.toString();
    if (this.isCurrentFavorite) {
      this.favoritesService.removeFavorite(id);
    } else {
      this.favoritesService.addFavorite(id);
    }
  }

  // --- Utility and Lifecycle Methods ---

  private checkScroll() {
    if (!this.content || this.isLoading) return;

    const element = this.content.nativeElement;
    const hasScrollbar = element.scrollHeight > element.clientHeight;

    if (!hasScrollbar) {
      this.loadNextGeneration();
    }
  }


  private updateDisplayedPokemons() {
    let filtered = this.allPokemons.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm) || p.id.toString().includes(this.searchTerm)
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

  trackByPokemon(index: number, pokemon: Pokemon): string {
    return pokemon.id;
  }

  public getPokemonsToDisplay(): Pokemon[] {
    return this.displayedPokemons;
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  loadNextGeneration(): void {
    console.log('Carregando próxima geração:', this.currentGenIndex + 1);

    const { start, end } = this.generationRanges[this.currentGenIndex];
    const ids = Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());

    this.isLoading = true;

    console.log(this.isLoading);

    this.pokemonService.getPokemonsByIds(ids).subscribe(pokemons => {
      console.log('Pokémons carregados:', pokemons);
      this.allPokemons.push(...pokemons);
      this.updateDisplayedPokemons();
      this.isLoading = false;
      this.currentGenIndex++;

      setTimeout(() => this.checkScroll(), 100);
    });

    console.log(this.isLoading);

  }

}