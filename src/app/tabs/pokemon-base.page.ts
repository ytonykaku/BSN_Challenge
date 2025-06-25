import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pokemon, PokemonDetails } from '../models/pokemon.models';
import { PokemonService } from '../services/pokemon.service';
import { UiStateService } from '../services/ui-state.service';
import { FavoritesService } from '../services/favorites.service';
import { BreakpointService } from '../services/breakpoint.service';
import { PokemonDetailModalComponent } from '../components/pokemon-detail-modal/pokemon-detail-modal.component';
import { heart, heartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Directive()
export abstract class PokemonBasePage implements OnInit, OnDestroy {
  // Propriedades de Estado
  public allPokemons: Pokemon[] = [];
  public displayedPokemons: Pokemon[] = [];
  public selectedPokemonDetails: PokemonDetails | null = null;
  public isDetailLoading = false;
  public isDesktop = true;
  public isCurrentFavorite = false;
  public isOpen = false;
  public isLoading = true;
  public sortKey: 'id' | 'name' = 'id';

  // Propriedades de Subscrição
  protected breakpointSub!: Subscription;
  protected favoritesSub!: Subscription;

  constructor(
    protected pokemonService: PokemonService,
    protected uiStateService: UiStateService,
    protected favoritesService: FavoritesService,
    protected breakpointService: BreakpointService,
    protected modalCtrl: ModalController
  ) {
    addIcons({ heart, 'heart-outline': heartOutline });
   }

  ngOnInit(): void {
    this.uiStateService.isPokedexOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
    });
    this.breakpointSub = this.breakpointService.isDesktop$.subscribe(isDesktop => {
      this.isDesktop = isDesktop;
    });
  }

  ngOnDestroy(): void {
    if (this.breakpointSub) this.breakpointSub.unsubscribe();
    if (this.favoritesSub) this.favoritesSub.unsubscribe();
  }

  // --- MÉTODOS DE UI E INTERAÇÃO ---

  public selectPokemon(pokemon: Pokemon, event?: MouseEvent): void {
    event?.stopPropagation();
    if (this.isDetailLoading) return;

    this.isDetailLoading = true;
    this.selectedPokemonDetails = null;

    this.pokemonService.getPokemonDetails(pokemon.id.toString()).subscribe(details => {
      this.isDetailLoading = false;
      this.isCurrentFavorite = this.favoritesService.isFavorite(details.id.toString());

      if (this.isDesktop) {
        this.selectedPokemonDetails = details;
      } else {
        this.openPokemonDetailModal(details);
      }
    });
  }

  public async openPokemonDetailModal(details: PokemonDetails): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: PokemonDetailModalComponent,
      componentProps: {
        details: details,
        isFavorite: this.isCurrentFavorite
      }
    });

    await modal.present();

    const { role } = await modal.onDidDismiss();

    if (role === 'favoriteToggled') {
      this.toggleFavoriteLogic(details.id.toString());
    }
  }

  public toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    if (this.selectedPokemonDetails) {
      this.toggleFavoriteLogic(this.selectedPokemonDetails.id.toString());
    }
  }

  protected toggleFavoriteLogic(pokemonId: string): void {
    if (this.favoritesService.isFavorite(pokemonId)) {
      this.favoritesService.removeFavorite(pokemonId);
    } else {
      this.favoritesService.addFavorite(pokemonId);
    }

    if (this.selectedPokemonDetails && this.selectedPokemonDetails.id.toString() === pokemonId) {
        this.isCurrentFavorite = !this.isCurrentFavorite;
    }
  }
  
  // --- MÉTODOS DE DADOS E TEMPLATE ---

  protected updateDisplayedPokemons(): void {
    this.displayedPokemons = [...this.allPokemons];
  }

  public getPokemonsToDisplay(): Pokemon[] {
    return this.displayedPokemons;
  }
  
  public trackByPokemon(index: number, pokemon: Pokemon): string {
    return pokemon.id;
  }
  
  public onScroll(event: any): void { }
  togglePokedex(): void {
    if (!this.isOpen){ this.isOpen = !this.isOpen;
    this.uiStateService.setPokedexOpen(this.isOpen);}
    return;
  }
  public onSearchChange(event: any): void { }
  public onSortChange(event: any): void { }

  protected mapDetailsToPokemon(details: PokemonDetails): Pokemon {
    return {
      id: details.id.toString(),
      name: details.name,
      url: `https://pokeapi.co/api/v2/pokemon/${details.id}/`,
      imageUrl: details.sprites.other?.['official-artwork']?.front_default || ''
    };
  }
}