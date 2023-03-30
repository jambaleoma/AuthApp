import { inject, NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AuthService } from './services/auth.service';

const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.component').then((mod) => mod.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((mod) => mod.DashboardComponent),
    canActivate: [() => inject (AuthService).isLoggedIn()]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
