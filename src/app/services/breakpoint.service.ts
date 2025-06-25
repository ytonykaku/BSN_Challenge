import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { startWith, map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private isDesktop = new BehaviorSubject<boolean>(this.checkIsDesktop());

  public isDesktop$: Observable<boolean>;

  constructor() {
    this.isDesktop$ = this.isDesktop.asObservable().pipe(distinctUntilChanged());

    fromEvent(window, 'resize').pipe(
      map(() => this.checkIsDesktop()),
      distinctUntilChanged()
    ).subscribe(result => {
      this.isDesktop.next(result);
    });
  }

  private checkIsDesktop(): boolean {
    return window.matchMedia('(min-width: 768px)').matches;
  }
}