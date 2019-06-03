import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StoreModule.forRoot(reducers, { metaReducers })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
