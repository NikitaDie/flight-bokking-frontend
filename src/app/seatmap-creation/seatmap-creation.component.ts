import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
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
  rows: number[] | undefined;
  columns: string[] | undefined;
  dragedCell: Seatplace | undefined;
  selectable: Selectable | undefined;
  selectedItems: { row: number, column: number }[] = [];

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {
    this.selectable = new Selectable({});
  }

  ngAfterViewInit() {
    this.resolveSelectable();
  }

  @HostListener('document:keydown.control', ['$event'])
  onCtrlKeyDown(event: KeyboardEvent) {
    console.log(this.selectable.getSelectedItems());
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
    this.cdr.detectChanges();
    this.selectable.setContainer(this.container.nativeElement);
  }

  private updateRows(length: number) {
    this.rows = Array.from({length: length }, (_, i) => i);
    this.resolveSelectable();
  }

  private getMaxColIndex(): number {
    if (!this.seats) return 0;
    return Math.max(...this.seats.map(seat => seat.column));
  }

  private updateCols(maxIndex: number) {
    this.columns = Array.from({length: maxIndex}, (_, i) => String.fromCharCode(65 + i));
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

  addNewSeatplaces() {
    if (!this.selectable)
      return;

    this.updateSelection();
    this.selectedItems.forEach((value) => {
      if (!this.seats || this.isSeat(value.row, value.column)) return;
      //check if already exists with such coord
      this.seats.push(new Seatplace("Hi", value.row, value.column, false));
    });
    this.selectable.clear();
  }

  private deleteSeatplace(row: number, col: number) {
    if(!this.seats) return;
    this.seats = this.seats.filter((value) => !(value.row === row && value.column === col && !value.reserved));
  }

  deleteSeatplaces() {
    if (!this.selectable)
      return;

    this.updateSelection();
    this.selectedItems.forEach((seat => {
      this.deleteSeatplace(seat.row, seat.column)
    }));
  }

}
