import { Component, Input, Output, EventEmitter } from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {ContextMenuModel} from "../Interfaces/context-menu-model";


@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
  @Input()
  contextMenuItems: Array<ContextMenuModel> = [];

  @Output()
  onContextMenuItemClick: EventEmitter<any> = new EventEmitter<any>();

  // @ts-ignore
  onContextMenuClick(event, data): any {
    this.onContextMenuItemClick.emit({
      event,
      data,
    });
  }
}
