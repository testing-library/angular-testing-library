import { Component } from '@angular/core';
import { vi, describe, test, afterEach, beforeEach } from 'vitest';
import { throwError } from 'rxjs';
import { render, screen, fireEvent } from '../../public_api';

@Component({
  selector: 'atl-fixture',
  template: `<button (click)="onTest()">Test</button>`,
  styles: [],
})
class TestComponent {
  onTest() {
    throwError(() => new Error('myerror')).subscribe();
  }
}

describe('TestComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTicks();
    vi.useRealTimers();
  });

  test('does not fail', async () => {
    await render(TestComponent);
    fireEvent.click(screen.getByText('Test'));
  });

  test('fails because of the previous one', async () => {
    await render(TestComponent);
    fireEvent.click(screen.getByText('Test'));
  });
});
