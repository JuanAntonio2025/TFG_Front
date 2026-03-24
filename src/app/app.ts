import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { AppNotification } from './shared/components/app-notification/app-notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, AppNotification],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
