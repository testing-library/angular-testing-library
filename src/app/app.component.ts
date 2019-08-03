import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GreetService } from './greet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';

  constructor(private store: Store<any>, private greetService: GreetService) {}

  greet() {
    this.greetService.greet();
  }
}
