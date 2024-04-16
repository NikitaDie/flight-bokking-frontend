import {Component, ViewChild, ElementRef, AfterViewInit, SimpleChanges, Input} from '@angular/core';

// @ts-ignore
import Selectable from 'selectable.js';
import {NgForOf, NgIf} from "@angular/common";
import {CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {Seatplace} from "../seatplace";
import {CdkContextMenuTrigger, CdkMenu, CdkMenuItem} from "@angular/cdk/menu";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    NgForOf,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    NgIf,
    CdkMenu,
    CdkMenuItem,
    CdkContextMenuTrigger
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  // @ts-ignore
  @ViewChild('container') container: ElementRef;
  @Input() seats: Seatplace[] | undefined;
  dragedCell: Seatplace | undefined;
  // @ts-ignore
  selectable;
  rows: number[] = [];
  columns: string[] = [];

  ngAfterViewInit() {
    console.log(this.container);
    this.selectable = new Selectable({
      container: this.container.nativeElement
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['seats']) {
      this.updateRows(this.getMaxRowIndex());
      this.updateCols(this.getMaxColIndex() + 1);
    }
  }

  update(value: number, source: string) {
    if (value === undefined) return;

    if (source === 'rowBox')
    {
      if (value < this.getMaxRowIndex())
        return;
      if (value > 40)
        return;

      this.updateRows(value);
    }
    else if (source === 'colBox')
    {
      if (value < this.getMaxColIndex()  + 1)
        return;
      if (value > 15)
        return;

      this.updateCols(value);
    }
  }

  private getMaxRowIndex(): number {
    if (!this.seats) return 1;
    return Math.max(...this.seats.map(seat => seat.row)) + 1;
  }

  private updateRows(length: number) {
    this.rows.length = 0;

    for (let i = 0; i < length; i++) {
      this.rows.push(i);
    }
  }

  private getMaxColIndex(): number {
    if (!this.seats) return 0;
    return Math.max(...this.seats.map(seat => seat.column));
  }

  private updateCols(maxIndex: number) {
    this.columns = Array.from({length: maxIndex}, (_, i) => String.fromCharCode(65 + i));
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

  protected readonly Number = Number;
}
