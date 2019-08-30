import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.mode';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, BrowserAnimationsModule, StoreModule.forRoot({}), MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
