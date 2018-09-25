import {
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrop,
} from '@angular/cdk-experimental/drag-drop';
import { keys, values } from 'lodash';

import { Mapping, MapItem } from '../types';
import { getAvailableKeys, toMapItem } from '../utils';

@Component({
  selector: 'app-remapping',
  templateUrl: './remapping.component.html',
  styleUrls: ['./remapping.component.scss']
})
export class RemappingComponent implements AfterViewInit, OnInit {
  @ViewChildren('newAssignmentDropsite') newAssignmentDropsite: QueryList<CdkDrop<MapItem>>;
  @ViewChild('availableDropsite') availableDropsite: CdkDrop<MapItem>;

  @Input() initialMapping: Mapping;

  /** Emits the latest state of the mapping. Incomplete mappings are emitted. */
  @Output() mapping = new EventEmitter<Mapping>();

  originalAssignments: MapItem[] = [];
  newAssignments: MapItem[][] = [];
  available: MapItem[] = [];
  connections: CdkDrop<MapItem>[][] = [];
  availableConnections: CdkDrop<MapItem>[] = [];
  showPlaceholder: boolean[] = [];

  /**
   * Sets up the inputs to the dropsites' connectedTo properties based on the current selections.
   */
  connectDropsites() {
    const naArr = this.newAssignmentDropsite.toArray();
    this.availableConnections = naArr.filter((_na, idx) => this.newAssignments[idx].length === 0);
    this.connections = naArr.map((_cd, idx) => {
      const conns = naArr.filter((_na, naIdx) => naIdx !== idx
        && this.newAssignments[naIdx].length === 0);
      conns.push(this.availableDropsite);
      return conns;
    });
  }

  /**
   * Emits the current state of the user's mapping via this component's mapping @Output.
   */
  emitMapping() {
    const mapping: Mapping = {};
    this.newAssignments.forEach((v, idx) => {
      mapping[this.originalAssignments[idx].key] = (v.length > 0) ? v[0].key : null;
    });
    this.mapping.emit(mapping);
  }

  /**
   * Initializes this component's properties based on the initial mapping.
   */
  initProps() {
    this.originalAssignments = keys(this.initialMapping).map(toMapItem);
    this.available = getAvailableKeys(this.initialMapping).map(toMapItem);
    const vals = values(this.initialMapping);
    this.newAssignments = vals.map(v => v ? [toMapItem(v)] : []);
    this.showPlaceholder = vals.map(v => !v);
  }

  ngOnInit() {
    this.initProps();
    this.emitMapping();
  }

  /**
   * Calls initializer method(s) that use the @ViewChild and @ViewChildren properties.
   */
  ngAfterViewInit() {
    // Change template data bindings after current event loop tick as per
    // https://angular.io/guide/component-interaction#parent-calls-an-viewchild
    setTimeout(() => this.connectDropsites());
  }

  /**
   * Performs all the backing changes that must happen when a draggable item is dropped into
   * a dropsite.
   *
   * Specifically: Rearrange the items when an item is dropped within the same dropsite, else:
   * 1. Move the item to the new dropsite's backing array,
   * 2. Update the dropsites' connections to each other, and
   * 3. Emit the new item map via the mapping @Output.
   *
   * @param event Event from cdk-drop's "dropped" event.
   */
  drop(event: CdkDragDrop<MapItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.connectDropsites();
      this.emitMapping();
    }
  }

  /**
   * Sets whether the "Drag and drop here to assign" message is displayed in one of the
   * dropsites in the "New Assignments" column.
   *
   * @param idx Index of the dropsite in the "New Assignments" column.
   * @param show Whether the placeholder should be shown in that dropsite.
   */
  setShowPlaceholder(idx: number, show: boolean) {
    this.showPlaceholder[idx] = show;
  }
}
