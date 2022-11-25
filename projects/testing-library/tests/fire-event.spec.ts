import { Component } from '@angular/core';
import { render, fireEvent, screen } from '../src/public_api';
import { FormsModule } from '@angular/forms';

describe('fireEvent', () => {
  @Component({
    selector: 'atl-fixture',
    template: ` <input type="text" data-testid="input" [(ngModel)]="name" name="name" />
      <div>Hello {{ name }}</div>`,
  })
  class FixtureComponent {
    name = '';
  }

  it('automatically detect changes when event is fired', async () => {
    await render(FixtureComponent, {
      imports: [FormsModule],
    });

    fireEvent.input(screen.getByTestId('input'), { target: { value: 'Tim' } });

    expect(screen.getByText('Hello Tim')).toBeInTheDocument();
  });

  it('can disable automatic detect changes when event is fired', async () => {
    const { detectChanges } = await render(FixtureComponent, {
      imports: [FormsModule],
      autoDetectChanges: false,
    });

    fireEvent.input(screen.getByTestId('input'), { target: { value: 'Tim' } });

    expect(screen.queryByText('Hello Tim')).not.toBeInTheDocument();

    detectChanges();

    expect(screen.getByText('Hello Tim')).toBeInTheDocument();
  });

  it('does not call detect changes when fixture is destroyed', async () => {
    const { fixture } = await render(FixtureComponent);

    fixture.destroy();

    // should otherwise throw
    fireEvent.input(screen.getByTestId('input'), { target: { value: 'Bonjour' } });
  });
});
