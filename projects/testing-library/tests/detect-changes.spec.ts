import { Component, OnInit } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { render, fireEvent, screen } from '../src/public_api';

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
  it('does not recognize change if execution is delayed', async () => {
    await render(FixtureComponent);

    fireEvent.input(screen.getByTestId('input'), {
      target: {
        value: 'What a great day!',
      },
    });
    expect(screen.getByTestId('button').innerHTML).toBe('Button');
  });

  it('exposes detectChanges triggering a change detection cycle', fakeAsync(async () => {
    const { detectChanges } = await render(FixtureComponent);

    fireEvent.input(screen.getByTestId('input'), {
      target: {
        value: 'What a great day!',
      },
    });

    // TODO: The code should be running in the fakeAsync zone to call this function ?
    // tick(500);
    await new Promise((resolve) => setTimeout(resolve, 500));

    detectChanges();

    expect(screen.getByTestId('button').innerHTML).toBe('Button updated after 400ms');
  }));

  it('does not throw on a destroyed fixture', async () => {
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
