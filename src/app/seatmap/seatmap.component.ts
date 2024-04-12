import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-seatmap',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    NgForOf,
    NgIf
  ],
  templateUrl: './seatmap.component.html',
  styleUrl: './seatmap.component.scss'
})
export class SeatmapComponent {
  tableData: any[][] = [
    ['A1', 'B1', 'C1'],
    ['A2', 'B2', 'C2'],
    ['A3', 'B3', 'C3']
  ];

}
