import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonBasePage } from '../tabs/pokemon-base.page';
import { Subscription } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
import { UiStateService } from '../services/ui-state.service';
import { FavoritesService } from '../services/favorites.service';
import { BreakpointService } from '../services/breakpoint.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['../tab1/tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab2Page extends PokemonBasePage {
  public override isLoading = false;
  private favoritesLoaderSubscription!: Subscription;

  constructor(
    pokemonService: PokemonService,
    uiStateService: UiStateService,
    favoritesService: FavoritesService,
    breakpointService: BreakpointService,
    modalCtrl: ModalController,
  ) {
    super(pokemonService, uiStateService, favoritesService, breakpointService, modalCtrl);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.isLoading = true;
    this.favoritesLoaderSubscription = this.favoritesService
      .getFavorites()
      .subscribe((favoriteIds) => {
        const ids = Array.from(favoriteIds);
        this.loadFavoritePokemons(ids);
      });
  }

  private loadFavoritePokemons(ids: string[]): void {
    if (ids.length === 0) {
      this.allPokemons = [];
      this.updateDisplayedPokemons();
      this.isLoading = false;
      return;
    }
    this.pokemonService.getPokemonsByIds(ids).subscribe((favoritePokemons) => {
      this.allPokemons = favoritePokemons;
      this.updateDisplayedPokemons();
      this.isLoading = false;
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.favoritesLoaderSubscription?.unsubscribe();
  }
}
