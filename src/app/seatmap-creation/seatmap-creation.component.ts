import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
import {Seatplace} from "../seatplace";
import {FlightService} from "../flight-service.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-seatmap-creation',
  standalone: true,
    imports: [
        CdkDrag,
        CdkDropList,
        CdkDropListGroup,
        NgForOf,
        NgIf
    ],
  templateUrl: './seatmap-creation.component.html',
  styleUrl: './seatmap-creation.component.scss'
})
export class SeatmapCreationComponent implements OnChanges  {
  @Input() seats: Seatplace[] | undefined;
  rows: number[] | undefined;
  columns: string[] | undefined;
  dragedCell: Seatplace | undefined;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['seats']) {
      this.updateRowsAndColumns();
    }
  }

  private updateRowsAndColumns() {
    if (!this.seats) return;

    this.rows = Array.from({ length: Math.max(...this.seats.map(seat => seat.row)) + 1 }, (_, i) => i);
    this.columns = Array.from({ length: Math.max(...this.seats.map(seat => seat.column)) + 1 },
      (_, i) => String.fromCharCode(65 + i));
  }


  isSeat(row: number, column: number): boolean {
    const seat = this.seats?.find(s => s.row === row && s.column === column);
    return !!seat;
  }

  isSeatReserved(row: number, column: number): boolean {
    const seat = this.seats?.find(s => s.row === row && s.column === column);
    return seat ? seat.reserved : false;
  }

  onDrop(event: CdkDragDrop<any[]>, row: number, col: number): void {
    if(!this.isSeat(row, col) && this.dragedCell) {
      this.dragedCell.row = row;
      this.dragedCell.column = col;
    }
  }

  onDragStarted($event: CdkDragStart, row: number, col: number) {
    this.dragedCell = this.seats?.find(s => s.row === row && s.column === col);
  }

  canDrop(row: number, col: number) {
    return () => !this.isSeat(row, col);
  }
}
