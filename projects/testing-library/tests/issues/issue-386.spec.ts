import {Component} from '@angular/core';
import {throwError} from 'rxjs';
import {render, screen} from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

@Component({
  selector: 'app-test',
  template: `<button (click)="onTest()">Test</button>`,
  styles: [],
})
export class TestComponent {
  onTest() {
    throwError(() => new Error('myerror')).subscribe();
  }
}


describe('TestComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTicks();
    jest.useRealTimers();
  })

  it('does not fail', async () => {
    await render(TestComponent);
    await userEvent.click(screen.getByText('Test'));
  });

  it('fails because of the previous one', async () => {
    await render(TestComponent);
    await userEvent.click(screen.getByText('Test'));
  });
});
