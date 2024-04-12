import {Component, OnInit} from '@angular/core';
import {Flight} from "../flight";
import {FlightService} from "../flight-service.service";
import {ActivatedRoute} from "@angular/router";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {SeatmapCreationComponent} from "../seatmap-creation/seatmap-creation.component";

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    NgIf,
    SeatmapCreationComponent
  ],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss'
})
export class FlightDetailsComponent implements OnInit {
  flight: Flight | undefined;

  constructor(
    private flightService: FlightService,
    private route :ActivatedRoute) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);

    if (id) {
      this.flightService.getFlight(id)
        .subscribe(flight => {
          this.flight = flight;
        });
    } else {
      console.error('Flight ID not found in route parameters');
    }
  }
}
