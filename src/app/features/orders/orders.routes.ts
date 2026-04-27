import { Routes } from '@angular/router';
import { Checkout } from './pages/checkout/checkout';
import { OrdersHistory } from './pages/orders-history/orders-history';
import { CheckoutSuccess } from './pages/checkout-success/checkout-success';
import { CheckoutCancel } from './pages/checkout-cancel/checkout-cancel';

export const ordersRoutes: Routes = [
  {
    path: 'checkout',
    component: Checkout,
  },
  {
    path: 'checkout/success',
    component: CheckoutSuccess,
  },
  {
    path: 'checkout/cancel',
    component: CheckoutCancel,
  },
  {
    path: 'orders',
    component: OrdersHistory,
  },
];
