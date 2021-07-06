import { Component, OnInit } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { render, fireEvent, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
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
  it('does not recognize change if execution is delayed', async () => {
    await render(FixtureComponent, { imports: [ReactiveFormsModule] });

    fireEvent.input(screen.getByTestId('input'), {
      target: {
        value: 'What a great day!',
      },
    });
    expect(screen.getByTestId('button').innerHTML).toBe('Button');
  });

  it('exposes detectChanges triggering a change detection cycle', fakeAsync(async () => {
    const { detectChanges } = await render(FixtureComponent, {
      imports: [ReactiveFormsModule],
    });

    fireEvent.input(screen.getByTestId('input'), {
      target: {
        value: 'What a great day!',
      },
    });

    tick(500);
    detectChanges();

    expect(screen.getByTestId('button').innerHTML).toBe('Button updated after 400ms');
  }));

  it('does not throw on a destroyed fixture', async () => {
    const { fixture } = await render(FixtureComponent, { imports: [ReactiveFormsModule] });

    fixture.destroy();

    fireEvent.input(screen.getByTestId('input'), {
      target: {
        value: 'What a great day!',
      },
    });
    expect(screen.getByTestId('button').innerHTML).toBe('Button');
  });
});
