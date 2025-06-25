import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private pokedexOpenSubject = new BehaviorSubject<boolean>(false);
  public isPokedexOpen$ = this.pokedexOpenSubject.asObservable();

  setPokedexOpen(isOpen: boolean): void {
    this.pokedexOpenSubject.next(isOpen);
  }
}
