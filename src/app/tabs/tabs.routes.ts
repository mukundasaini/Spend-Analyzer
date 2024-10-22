import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home-tab/home.page').then((m) => m.HomePage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings-tab/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('../analytics-tab/analytics.page').then((m) => m.AnalyticsPage),
      },
      {
        path: '',
        redirectTo: 'tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
