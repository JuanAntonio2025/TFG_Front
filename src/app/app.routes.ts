import { Routes } from '@angular/router';

import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

import { Landing } from './features/public/pages/landing/landing';
import { Catalog } from './features/public/pages/catalog/catalog';
import { BookDetail } from './features/public/pages/book-detail/book-detail';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { CartComponent } from './features/cart/pages/cart/cart';
import { Checkout } from './features/orders/pages/checkout/checkout';
import { LibraryComponent } from './features/library/pages/library/library';
import { Dashboard } from './features/admin/pages/dashboard/dashboard';
import { OrdersHistory } from './features/orders/pages/orders-history/orders-history';
import { IncidencesList } from './features/incidences/pages/incidences-list/incidences-list';
import { IncidenceDetail } from './features/incidences/pages/incidence-detail/incidence-detail';

import { BooksAdmin } from './features/admin/pages/books-admin/books-admin';
import { CategoriesAdmin } from './features/admin/pages/categories-admin/categories-admin';
import { UsersAdmin } from './features/admin/pages/users-admin/users-admin';
import { IncidencesAdmin } from './features/admin/pages/incidences-admin/incidences-admin';

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
    component: CartComponent,
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [authGuard]
  },
  {
    path: 'library',
    component: LibraryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'orders/history',
    component: OrdersHistory,
    canActivate: [authGuard]
  },
  {
    path: 'incidences',
    component: IncidencesList,
    canActivate: [authGuard]
  },
  {
    path: 'incidences/:id',
    component: IncidenceDetail,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/books',
    component: BooksAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/categories',
    component: CategoriesAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/users',
    component: UsersAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/incidences',
    component: IncidencesAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'support'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
