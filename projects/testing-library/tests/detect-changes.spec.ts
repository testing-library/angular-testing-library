import { Component, OnInit } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: `
    <input type="text" data-testid="input" [formControl]="inputControl" />
    <button data-testid="button">{{ caption }}</button>
  `,
})
class FixtureComponent implements OnInit {
  inputControl = new FormControl();
  caption = 'Button';

  ngOnInit() {
    this.inputControl.valueChanges.pipe(delay(400)).subscribe(() => (this.caption = 'Button updated after 400ms'));
  }
}

describe('detectChanges', () => {
  test('does not recognize change if execution is delayed', async () => {
    const { getByTestId, type } = await render(FixtureComponent, { imports: [ReactiveFormsModule] });

    type(getByTestId('input'), 'What a great day!');
    expect(getByTestId('button').innerHTML).toBe('Button');
  });

  test('exposes detectChanges triggering a change detection cycle', fakeAsync(async () => {
    const { getByTestId, type, detectChanges } = await render(FixtureComponent, {
      imports: [ReactiveFormsModule],
    });

    type(getByTestId('input'), 'What a great day!');

    tick(500);
    detectChanges();

    expect(getByTestId('button').innerHTML).toBe('Button updated after 400ms');
  }));
});
