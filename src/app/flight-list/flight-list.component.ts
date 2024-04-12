import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Flight } from "../flight";
import { FlightService } from "../flight-service.service";
import { NgForOf } from "@angular/common";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapSearch } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIconComponent,
    RouterLink
  ],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss',
  providers: [provideIcons({ bootstrapSearch })]
})
export class FlightListComponent implements OnInit {
  flights: Flight[] = [];

  constructor(private flightService: FlightService)
  { }

  ngOnInit() {
    this.flightService.getFlights().subscribe((data: Flight[]) => {
      this.flights = data
    });
  }

}
