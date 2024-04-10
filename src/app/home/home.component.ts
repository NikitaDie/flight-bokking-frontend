import { Component } from '@angular/core';
import {FlightListComponent} from "../flight-list/flight-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FlightListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
