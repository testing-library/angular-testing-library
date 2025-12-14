import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { describe, test, expect } from 'vitest';
import { render, fireEvent, screen } from '../public_api';

@Component({
  selector: 'atl-fixture',
  template: `
    <input type="text" data-testid="input" [formControl]="inputControl" />
    <button data-testid="button">{{ caption }}</button>
  `,
  standalone: true,
  imports: [ReactiveFormsModule],
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
    await render(FixtureComponent);

    fireEvent.input(screen.getByTestId('input'), {
      target: {
        value: 'What a great day!',
      },
    });
    expect(screen.getByTestId('button').innerHTML).toBe('Button');
  });

  test('does not throw on a destroyed fixture', async () => {
    const { fixture } = await render(FixtureComponent);

    fixture.destroy();

    fireEvent.input(screen.getByTestId('input'), {
      target: {
        value: 'What a great day!',
      },
    });
    expect(screen.getByTestId('button').innerHTML).toBe('Button');
  });
});
