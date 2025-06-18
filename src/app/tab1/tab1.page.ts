import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngFor, *ngIf, etc.
import { IonicModule } from '@ionic/angular'; // Importa todos os componentes do Ionic de uma vez
import { PokemonService, PokemonListItem } from '../services/pokemon.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true, // Confirma que o componente é independente
  imports: [
    IonicModule,    // Adicione o IonicModule aqui
    CommonModule,   // Adicione o CommonModule aqui
  ],
})
export class Tab1Page implements OnInit {

  // O resto do código permanece exatamente o mesmo
  public pokemons: PokemonListItem[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemonList().subscribe(response => {
      this.pokemons = response.results;
      console.log('Pokémon carregados:', this.pokemons);
    });
  }
}