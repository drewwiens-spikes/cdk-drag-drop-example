import { Component } from '@angular/core';

import { Mapping } from './types';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  newMapping: Mapping = {};
  initialMapping: Mapping = {
    A: null,
    B: 'A',
    C: null,
    D: null
  };

  updateMapping(mapping: Mapping) {
    this.newMapping = mapping;
  }
}
