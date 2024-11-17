import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { wallet, card, apps, analytics, settings } from 'ionicons/icons';
import { LoggerService } from '../services/logger.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private log: LoggerService) {
    log.trackEventCalls(TabsPage.name, "constructor");
    addIcons({ wallet, card, apps, analytics, settings });
  }
}
