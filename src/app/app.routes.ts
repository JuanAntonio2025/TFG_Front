import { Routes } from '@angular/router';

import { guestGuard } from './core/guards/guest-guard';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

import { Landing } from './features/public/pages/landing/landing';
import { Catalog } from './features/public/pages/catalog/catalog';
import { BookDetail } from './features/public/pages/book-detail/book-detail';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { Faq } from './features/public/pages/faq/faq';
import { ForgotPassword } from './features/auth/pages/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/pages/reset-password/reset-password';

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
import { ReviewsAdmin } from './features/admin/pages/reviews-admin/reviews-admin';

import { ReaderComponent } from './features/library/pages/reader/reader';
import { Profile } from './features/auth/pages/profile/profile';

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
    path: 'faq',
    component: Faq
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPassword,
    canActivate: [guestGuard]
  },
  {
    path: 'auth/reset-password',
    component: ResetPassword,
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
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  {
    path: 'reader/:bookId',
    component: ReaderComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: Dashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/books',
    component: BooksAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'employee'] }
  },
  {
    path: 'admin/categories',
    component: CategoriesAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'employee'] }
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
    path: 'support/incidences',
    component: IncidencesAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'support'] }
  },
  {
    path: 'admin/reviews',
    component: ReviewsAdmin,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
