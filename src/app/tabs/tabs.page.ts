import {
  Component,
  EnvironmentInjector,
  inject,
  OnDestroy,
  OnInit,
  HostBinding,
} from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { UiStateService } from '../services/ui-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage implements OnInit, OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);
  @HostBinding('class.pokedex-is-open') public isPokedexOpen = false;
  private stateSubscription!: Subscription;

  constructor(private uiStateService: UiStateService) {
    addIcons({ triangle, ellipse, square });
  }

  ngOnInit() {
    this.stateSubscription = this.uiStateService.isPokedexOpen$.subscribe((isOpen) => {
      this.isPokedexOpen = isOpen;
    });
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
}
