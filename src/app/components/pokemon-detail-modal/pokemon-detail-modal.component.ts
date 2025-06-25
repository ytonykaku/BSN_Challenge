import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { PokemonDetails } from '../../models/pokemon.models';
import { heart, heartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

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

  constructor(private modalCtrl: ModalController) {
    addIcons({ heart, 'heart-outline': heartOutline });
   }
   

  ngOnInit() {}

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}