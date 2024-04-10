import {Component, OnInit} from '@angular/core';
import {Flight} from "../flight";
import {FlightService} from "../flight-service.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.scss'
})
export class FlightListComponent implements OnInit {
  flights?: Flight[];

  constructor(private flightService: FlightService)
  { }

  ngOnInit() {
    this.flightService.findAll().subscribe(data => this.flights = data);
  }

}
