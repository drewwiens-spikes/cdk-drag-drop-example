import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk-experimental/drag-drop';

import { AppComponent } from './app.component';
import { RemappingComponent } from './remapping/remapping.component';

@NgModule({
  imports:      [ BrowserModule, DragDropModule ],
  declarations: [ AppComponent, RemappingComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
