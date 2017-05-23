import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {ProductsComponent} from "./products/products.component";
import {ProfileComponent} from "./profile/profile.component";
import {CallbackComponent} from "./callback/callback.component";
import {SecurityComponent} from "./security/security.component";
import {AuthGuard} from "./services/auth-guard.service";

const appRoutes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'products',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'security',
    component: SecurityComponent
  },
  {
    path: 'callback',
    component: CallbackComponent,
  }
];

// {path: '**', redirectTo: ''}

// We'll use the canActivate API and pass in our AuthGuard. Now any time the /special route is hit,
// the AuthGuard will run first to make sure the user is logged in before activating and loading this route.

export const routedComponents = [ProductsComponent, ProfileComponent, CallbackComponent, SecurityComponent];
export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
