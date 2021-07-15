import { Component } from '@angular/core';
import { render, waitFor, screen } from '../../src/public_api';

@Component({
  template: ` <button [ngClass]="classes">Load</button> `,
})
class LoopComponent {
  get classes() {
    return {
      someClass: true,
    };
  }
}

test('wait does not end up in a loop', async () => {
  await render(LoopComponent);

  await expect(
    waitFor(() => {
      expect(true).toEqual(false);
    }),
  ).rejects.toThrow();
});

test('find does not end up in a loop', async () => {
  await render(LoopComponent);

  await expect(screen.findByText('foo')).rejects.toThrow();
});
