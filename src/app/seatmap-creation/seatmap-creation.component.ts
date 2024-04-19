import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {Seatplace} from "../seatplace";
import {ReactiveFormsModule} from "@angular/forms";
// @ts-ignore
import Selectable from 'selectable.js';
import {ContextMenuComponent} from "../context-menu/context-menu.component";
import {CdkContextMenuTrigger, CdkMenu, CdkMenuItem, CdkMenuTrigger} from "@angular/cdk/menu";
import '@angular/material/dialog';
import {MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-seatmap-creation',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ContextMenuComponent,
    NgStyle,
    CdkContextMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    MatDialogModule
  ],
  templateUrl: './seatmap-creation.component.html',
  styleUrl: './seatmap-creation.component.scss'
})
export class SeatmapCreationComponent implements OnChanges, AfterViewInit {
  // @ts-ignore
  @ViewChild('container') container: ElementRef;
  @Input() seats: Seatplace[] | undefined;
  rows: number[] = [];
  columns: string[] = [];
  dragedCell: Seatplace | undefined;
  selectable: Selectable | undefined;
  selectedItems: { row: number, column: number }[] = [];

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {
    this.selectable = new Selectable({});
  }

  ngAfterViewInit() {
    this.resolveSelectable();
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

  private resolveSelectable()
  {
    this.selectable.clear();
    this.cdr.detectChanges();
    this.selectable.setContainer(this.container.nativeElement);
  }

  private updateRows(length: number = this.rows?.length ?? 0) {
    let spacing = 0;
    this.rows = Array.from({length: length }, (_, i) => {
      if(this.hasRowAnySeats(i))
        return i - spacing;
      else
      {
        ++spacing;
        return -1;
      }
    });
    this.resolveSelectable();
  }

  private getMaxColIndex(): number {
    if (!this.seats) return 0;
    return Math.max(...this.seats.map(seat => seat.column));
  }

  private updateCols(maxIndex: number = this.columns?.length ?? 0) {
    let spacing = 0;
    this.columns = Array.from({length: maxIndex}, (_, i) =>
    {
      if (this.hasColAnySeats(i))
        return String.fromCharCode(65 + i - spacing);
      else
      {
        ++spacing;
        return ' ';
      }
    });
    this.resolveSelectable();
  }

  private updateSelection() {
    const selectedNodes = this.selectable.getSelectedNodes();
    this.selectedItems = selectedNodes.map((node: HTMLElement) => {
      // @ts-ignore
      const row = Array.from(node.parentElement.parentElement.children).indexOf(node.parentElement);
      // @ts-ignore
      const column = Array.from(node.parentElement.children).indexOf(node) - 1;
      return { row, column };
    });
  }

  getSeat(row: number, column: number): Seatplace | undefined {
    return this.seats ? this.seats.find(s => s.row === row && s.column === column) : undefined;
  }

  isSeat(row: number, column: number): boolean {
    return !!this.getSeat(row, column)
  }

  isSeatReserved(row: number, column: number): boolean {
    const seat = this.getSeat(row, column);
    return seat ? seat.isReserved : false;
  }

  onDrop(event: CdkDragDrop<any[]>, row: number, col: number): void {
    if(!this.isSeat(row, col) && this.dragedCell) {
      this.dragedCell.row = row;
      this.dragedCell.column = col;

      this.updateCols();
      this.updateRows();
    }
  }

  onDragStarted($event: CdkDragStart, row: number, col: number) {
    this.dragedCell = this.seats?.find(s => s.row === row && s.column === col);
  }

  canDrop(row: number, col: number) {
    return () => !this.isSeat(row, col);
  }

  protected readonly Number = Number;

  addNewSeatplaces() {
    if (!this.selectable)
      return;

    this.updateSelection();
    this.selectedItems.forEach((value) => {
      if (!this.seats || this.isSeat(value.row, value.column)) return;
      console.log(value.row, value.column);
      this.seats.push(new Seatplace('', false, value.row, value.column));
    });

    this.updateCols();
    this.updateRows();
  }

  private deleteSeatplace(row: number, col: number) {
    if(!this.seats) return;

    //delete this.seats.find(s => s.row === row && s.column === col);

    const index = this.seats.findIndex(s => s.row === row && s.column === col && !s.isReserved);
    if (index !== -1 ) {
      this.seats.splice(index, 1);
    }
    //this.seats = this.seats.filter((seat) => !(seat.row === row && seat.column === col && !seat.isReserved));

  }

  deleteSeatplaces() {
    if (!this.selectable)
      return;

    this.updateSelection();
    this.selectedItems.forEach((seat => {
      this.deleteSeatplace(seat.row, seat.column)
    }));

    this.updateCols();
    this.updateRows();
    console.log(this.seats)
  }

  private hasColAnySeats(col: number): boolean {
    if (!this.seats) return false;
    const colSeats = this.seats.filter((seat) => seat.column === col);
    return colSeats.length > 0;
  }

  private hasRowAnySeats(row: number): boolean {
    if (!this.seats) return false;
    const rowSeats = this.seats.filter((seat) => seat.row === row );
    return rowSeats.length > 0;
  }

  updateNames() {
    this.seats?.forEach(seat => {
      seat.name = (this.rows[seat.row] + 1) + this.columns[seat.column];
    });
  }

  setReservation(event: any, row: number, column: number) {
    let seat = this.getSeat(row, column);
    if (!seat)
      return;

    seat.isReserved = event.target.checked;
  }
}
