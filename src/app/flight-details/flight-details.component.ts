import {Component, OnInit} from '@angular/core';
import {Flight} from "../flight";
import {FlightService} from "../flight-service.service";
import {ActivatedRoute} from "@angular/router";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragStart,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import {Seatplace} from "../seatplace";

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [
    NgForOf,
    NgStyle,
    NgIf,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup
  ],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss'
})
export class FlightDetailsComponent implements OnInit {
  flight: Flight | undefined;
  rows: number[] | undefined;
  columns: string[] | undefined;
  dragedCell: Seatplace | undefined;


  constructor(
    private flightService: FlightService,
    private route :ActivatedRoute) { }

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);

    if (id) {
      this.flightService.getFlight(id)
        .subscribe(flight => {
          this.flight = flight;
          this.rows = Array.from({ length: Math.max(...this.flight.seats.map(seat => seat.row)) + 1 }, (_, i) => i);
          this.columns = Array.from({ length: Math.max(...this.flight.seats.map(seat => seat.column)) + 1 }, (_, i) => String.fromCharCode(65 + i));
        });
    } else {
      console.error('Flight ID not found in route parameters');
    }
  }

  getUniqueRows(): number[] | undefined {
    return this.flight?.seats.map(seat => seat.row).filter((value, index, self) => self.indexOf(value) === index);
  }

  isSeat(row: number, column: number): boolean {
    const seat = this.flight?.seats.find(s => s.row === row && s.column === column);
    return !!seat;
  }

  isSeatReserved(row: number, column: number): boolean {
    const seat = this.flight?.seats.find(s => s.row === row && s.column === column);
    return seat ? seat.reserved : false;
  }

  onDrop(event: CdkDragDrop<any[]>, row: number, col: number): void {
    if(!this.isSeat(row, col)) {
      // @ts-ignore
      this.dragedCell.row = row;
      // @ts-ignore
      this.dragedCell.column = col;
    }
  }

  onDragStarted($event: CdkDragStart, row: number, col: number) {
    this.dragedCell = this.flight?.seats.find(s => s.row === row && s.column === col);
  }


  canDrop(row: number, col: number) {
    return () => !this.isSeat(row, col);
  }
}
