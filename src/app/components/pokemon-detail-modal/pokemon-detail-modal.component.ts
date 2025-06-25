// src/app/components/pokemon-detail-modal/pokemon-detail-modal.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { PokemonDetails } from '../../models/pokemon.models';
import { heart, heartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-pokemon-detail-modal',
  templateUrl: './pokemon-detail-modal.component.html',
  styleUrls: ['./pokemon-detail-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class PokemonDetailModalComponent implements OnInit {
  @Input() details!: PokemonDetails;
  @Input() isFavorite: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private favoritesService: FavoritesService
  ) {
    addIcons({ heart, 'heart-outline': heartOutline });
  }

  ngOnInit() {
    if (this.details && this.details.id) {
      this.isFavorite = this.favoritesService.isFavorite(String(this.details.id));
    }
  }

  toggleFavorite() {
    if (!this.details || !this.details.id) {
      return;
    }

    const pokemonIdAsString = String(this.details.id);

    if (this.isFavorite) {
      this.favoritesService.removeFavorite(pokemonIdAsString);
    } else {
      this.favoritesService.addFavorite(pokemonIdAsString);
    }
    this.isFavorite = !this.isFavorite;
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}