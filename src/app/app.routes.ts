import { Routes } from '@angular/router';

import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

import { Landing } from './features/public/pages/landing/landing';
import { Catalog } from './features/public/pages/catalog/catalog';
import { BookDetail } from './features/public/pages/book-detail/book-detail';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Cart } from './features/cart/pages/cart/cart';
import { Checkout } from './features/orders/pages/checkout/checkout';
import { Library } from './features/library/pages/library/library';
import { Dashboard } from './features/admin/pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Landing
  },
  {
    path: 'catalog',
    component: Catalog
  },
  {
    path: 'books/:id',
    component: BookDetail
  },
  {
    path: 'auth/login',
    component: Login,
    canActivate: [guestGuard]
  },
  {
    path: 'auth/register',
    component: Register,
    canActivate: [guestGuard]
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard]
  },
  {
    path: 'library',
    component: Library,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
