import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ShipUserDashboardComponent } from './sfd/ship-user-dashboard/ship-user-dashboard.component';
import { LogComponent } from './shared/components/log/log.component';
import { SidebarSubmenuComponent } from './shared/components/sidebar-submenu/sidebar-submenu.component';

const routes: Routes = [
  // Public routes (no authentication required)
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import('./about-us/about-us.component').then((m) => m.AboutUsComponent),
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./contact-us/contact-us.component').then(
        (m) => m.ContactUsComponent
      ),
  },
  { path: 'login',    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent), },

  // Default route redirects to home
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // Protected routes (require authentication)

  // Main layout protected routes
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'sfd',
        loadChildren: () => import('./sfd/sfd.module').then((m) => m.SfdModule),
      },
      {
        path: 'masters',
        loadChildren: () =>
          import('./masters/masters.module').then((m) => m.MastersModule),
        data: {
          breadcrumb: 'Masters',
        },
      },
      { path: 'submenu-cards', component: SidebarSubmenuComponent },
      {
        path: 'maintop',
        loadChildren: () =>
          import('./maintop/maintop.module').then((m) => m.MaintopModule),
      },
      {
        path: 'dart',
        loadChildren: () =>
          import('./dart/dart.module').then((m) => m.DartModule),
      },
      {
        path: 'srar',
        loadChildren: () =>
          import('./srar/srar.module').then((m) => m.SrarModule),
      },
      {
        path: 'setup',
        loadChildren: () =>
          import('./setup/setup.module').then((m) => m.SetupModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
