import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {Flight} from "../flight";
import {FlightService} from "../flight-service.service";
import {ActivatedRoute} from "@angular/router";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {SeatmapCreationComponent} from "../seatmap-creation/seatmap-creation.component";
import {Seatplace} from "../seatplace";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    NgIf,
    SeatmapCreationComponent,
    FormsModule,
  ],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss'
})
export class FlightDetailsComponent implements OnInit {
  @ViewChild('seatmap') seatmap!: SeatmapCreationComponent;
  // @ts-ignore
  flight: Flight

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
      this.flight = new Flight('', []);
    }
  }

  async onUpdate() {
    if (this.flight)
    {
      this.seatmap.updateNames();
      console.log(this.flight);
      await this.flightService.updateFlight(this.flight);
      this.flightService.getFlightByName(this.flight.name)
        .subscribe(flight => {
          this.flight = flight;
        });
    }
  }
}
