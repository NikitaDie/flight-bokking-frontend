import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
import {Seatplace} from "../seatplace";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-seatmap-creation',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './seatmap-creation.component.html',
  styleUrl: './seatmap-creation.component.scss'
})
export class SeatmapCreationComponent implements OnChanges  {
  @Input() seats: Seatplace[] | undefined;
  rowInputNumber: number = 0;
  colInputNumber: number = 0;
  rows: number[] | undefined;
  columns: string[] | undefined;
  dragedCell: Seatplace | undefined;

  @ViewChild('seatmapTable')
  seatmapTable: ElementRef;

  isMouseDown = false;
  mouseDownCell!: HTMLElement;

  constructor(seatmapTable: ElementRef) {
    this.seatmapTable = seatmapTable;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['seats']) {
      this.updateRows(this.getMaxRowIndex());
      console.log(this.getMaxColIndex());
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
    this.rows = Array.from({length: length }, (_, i) => i);
    console.log(this.rows);
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

  onCellMouseDown(event: MouseEvent, row: number, col: number) {

    this.mouseDownCell = this.getCellElement(row, col);
    this.mouseDownCell.classList.add('highlighted');
  }

  onCellMouseEnter(event: MouseEvent, row: number, col: number) {
    if (this.isMouseDown) {
      const currentCell = this.getCellElement(row, col);
      this.highlightCells(this.mouseDownCell, currentCell);
    }
  }

  onCellMouseUp() {
    this.isMouseDown = false;
  }

  getCellElement(row: number, col: number): HTMLElement {
    const tableElement = this.seatmapTable.nativeElement as HTMLTableElement;
    return tableElement.rows[row].cells[col];
  }

  highlightCells(startCell: HTMLElement, endCell: HTMLElement) {
    const tableElement = this.seatmapTable.nativeElement as HTMLTableElement;
    const cells = tableElement.getElementsByTagName('td');

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i] as HTMLElement;

      if (this.isBetween(cell, startCell, endCell)) {
        cell.classList.add('highlighted');
      } else {
        cell.classList.remove('highlighted');
      }
    }
  }

  isBetween(cell: HTMLElement, startCell: HTMLElement, endCell: HTMLElement): boolean {
    const cellRect = cell.getBoundingClientRect();
    const startCellRect = startCell.getBoundingClientRect();
    const endCellRect = endCell.getBoundingClientRect();

    return (
      cellRect.top >= Math.min(startCellRect.top, endCellRect.top) &&
      cellRect.bottom <= Math.max(startCellRect.bottom, endCellRect.bottom) &&
      cellRect.left >= Math.min(startCellRect.left, endCellRect.left) &&
      cellRect.right <= Math.max(startCellRect.right, endCellRect.right)
    );
  }

  protected readonly Number = Number;
}
