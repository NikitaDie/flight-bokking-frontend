import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FlightListComponent} from "./flight-list/flight-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlightListComponent, RouterLink,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'flight-booking';
}
