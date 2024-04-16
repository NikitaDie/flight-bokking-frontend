import {
  AfterViewInit, ChangeDetectorRef,
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
import {CdkContextMenuTrigger, CdkMenu, CdkMenuItem} from "@angular/cdk/menu";

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
  ],
  templateUrl: './seatmap-creation.component.html',
  styleUrl: './seatmap-creation.component.scss'
})
export class SeatmapCreationComponent implements OnChanges {
  // @ts-ignore
  @ViewChild('container') container: ElementRef;
  @Input() seats: Seatplace[] | undefined;
  rowInputNumber: number = 0;
  colInputNumber: number = 0;
  rows: number[] | undefined;
  columns: string[] | undefined;
  dragedCell: Seatplace | undefined;
  selectable: Selectable | undefined;
  selectedItems: { row: number, column: number }[] = [];

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) { }

  @HostListener('document:keydown.control', ['$event'])
  onCtrlKeyDown(event: KeyboardEvent) {
    console.log(this.selectable.getSelectedItems());
  }

  async ngOnChanges(changes: SimpleChanges) {
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
    // if (this.selectable)
    //   this.selectable.clear();
    this.rows = Array.from({length: length }, (_, i) => i);
    this.cdr.detectChanges();
    this.selectable = new Selectable({
      container: this.container.nativeElement
    });

    this.selectable.on('select', () => {
      this.updateSelection();
    });

    this.selectable.on('deselect', () => {
      this.updateSelection();
    });
  }

  private getMaxColIndex(): number {
    if (!this.seats) return 0;
    return Math.max(...this.seats.map(seat => seat.column));
  }

  private updateCols(maxIndex: number) {
    // if (this.selectable)
    //   this.selectable.clear();
    this.columns = Array.from({length: maxIndex}, (_, i) => String.fromCharCode(65 + i));
    this.cdr.detectChanges();
    this.selectable = new Selectable({
      container: this.container.nativeElement
    });
  }

  updateSelection() {
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
      if (!this.seats) return;
      //check if already exists with such coord
      this.seats.push(new Seatplace("Hi", value.row, value.column, false));
    });
    this.selectable.clear();
  }

}
