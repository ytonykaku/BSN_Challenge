// tab1.page.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonContent } from '@ionic/angular';
import { PokemonBasePage } from '../tabs/pokemon-base.page';
import { PokemonService } from '../services/pokemon.service';
import { UiStateService } from '../services/ui-state.service';
import { FavoritesService } from '../services/favorites.service';
import { BreakpointService } from '../services/breakpoint.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page extends PokemonBasePage {
  @ViewChild(IonContent) content!: IonContent;
  public override isLoading = false; // Começando com false

  private generationRanges = [
    { start: 1, end: 72 },
    { start: 73, end: 151 },
    { start: 152, end: 300 },
    { start: 301, end: 370 },
    { start: 371, end: 449 },
    { start: 450, end: 521 },
    { start: 522, end: 699 },
    { start: 700, end: 770 },
    { start: 771, end: 850 },
    { start: 851, end: 920 },
    { start: 921, end: 999 },
    { start: 1000, end: 1010 },
  ];
  private currentGenIndex = 0;
  private hasCheckedScroll = false;

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
    this.loadNextGeneration();
  }

  ionViewDidEnter() {
    if (!this.hasCheckedScroll) {
      this.checkScroll();
      this.hasCheckedScroll = true;
    }
  }

  override onScroll(event: Event): void {
    if (this.isLoading) return;

    const target = event.target as HTMLElement;
    if ((target.scrollTop + target.clientHeight) / target.scrollHeight >= 0.7) {
      // Aumentei para 70% para ficar mais confortável
      this.loadNextGeneration();
    }
  }

  // NOVA VERSÃO DO checkScroll - MAIS SEGURA
  private checkScroll() {
    // A guarda de segurança previne execuções múltiplas
    if (this.isLoading) {
      setTimeout(() => this.checkScroll(), 200); // Se estiver carregando, tenta de novo em 200ms
      return;
    }

    this.content.getScrollElement().then((element) => {
      const hasScrollbar = element.scrollHeight > element.clientHeight;

      // Se não tem barra de rolagem E ainda há o que carregar...
      if (!hasScrollbar && this.currentGenIndex < this.generationRanges.length) {
        console.log('Tela não preenchida, carregando próxima geração automaticamente...');
        this.loadNextGeneration();
      }
    });
  }

  // NOVA VERSÃO DO loadNextGeneration - CORRIGIDA
  loadNextGeneration(): void {
    if (this.isLoading || this.currentGenIndex >= this.generationRanges.length) {
      return;
    }

    console.log('Carregando próxima geração:', this.currentGenIndex + 1);
    this.isLoading = true;

    const { start, end } = this.generationRanges[this.currentGenIndex];
    const ids = Array.from({ length: end - start + 1 }, (_, i) => (start + i).toString());

    this.pokemonService.getPokemonsByIds(ids).subscribe((pokemons) => {
      this.allPokemons.push(...pokemons);
      this.updateDisplayedPokemons();
      this.isLoading = false;
      this.currentGenIndex++;
      console.log('Geração carregada:', this.currentGenIndex);
    });
  }
}
