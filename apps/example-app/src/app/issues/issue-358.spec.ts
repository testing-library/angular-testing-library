import { Component, Input } from '@angular/core';
import { render, screen, fireEvent } from '@testing-library/angular';

@Component({
  selector: 'app-root',
  template: ` <button (click)="decrement()">-</button>
    <span data-testid="count">Current Count: {{ counter }}</span>
    <button (click)="increment()">+</button>`,
})
class AppComponent {
  @Input() counter = 0;

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }
}

describe('Counter', () => {
  it('should render counter', async () => {
    await render(AppComponent, {
      componentProperties: { counter: 5 },
    });

    expect(screen.getByText('Current Count: 5')).toBeInTheDocument();
  });

  it('should increment the counter on click', async () => {
    await render(AppComponent, {
      componentProperties: { counter: 5 },
    });

    fireEvent.click(screen.getByText('+'));

    expect(screen.getByText('Current Count: 6')).toBeInTheDocument();
  });
});
