import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-cancel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-cancel.html',
  styleUrl: './checkout-cancel.scss',
})
export class CheckoutCancel {

}
