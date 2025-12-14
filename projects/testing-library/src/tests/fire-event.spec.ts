import { Component } from '@angular/core';
import { render, fireEvent, screen } from '../public_api';
import { describe, test, expect } from 'vitest';
import { FormsModule } from '@angular/forms';

describe('fireEvent', () => {
  @Component({
    selector: 'atl-fixture',
    template: ` <input type="text" data-testid="input" [(ngModel)]="name" name="name" />
      <div>Hello {{ name }}</div>`,
    standalone: true,
    imports: [FormsModule],
  })
  class FixtureComponent {
    name = '';
  }

  test('automatically detect changes when event is fired', async () => {
    await render(FixtureComponent);

    fireEvent.input(screen.getByTestId('input'), { target: { value: 'Tim' } });

    expect(screen.getByText('Hello Tim')).toBeInTheDocument();
  });

  test('can disable automatic detect changes when event is fired', async () => {
    const { detectChanges } = await render(FixtureComponent, {
      autoDetectChanges: false,
    });

    fireEvent.input(screen.getByTestId('input'), { target: { value: 'Tim' } });

    expect(screen.queryByText('Hello Tim')).not.toBeInTheDocument();

    detectChanges();

    expect(screen.getByText('Hello Tim')).toBeInTheDocument();
  });

  test('does not call detect changes when fixture is destroyed', async () => {
    const { fixture } = await render(FixtureComponent);

    fixture.destroy();

    // should otherwise throw
    fireEvent.input(screen.getByTestId('input'), { target: { value: 'Bonjour' } });
  });
});
