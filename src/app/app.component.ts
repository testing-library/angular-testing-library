import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GreetService } from './greet.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    age: ['', [Validators.min(18), Validators.max(28)]],
  });

  constructor(private store: Store<any>, private greetService: GreetService, private fb: FormBuilder) {}

  greet() {
    this.greetService.greet();
  }

  onSubmit() {}
}
