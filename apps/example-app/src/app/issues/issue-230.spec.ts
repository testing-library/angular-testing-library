import { Component } from '@angular/core';
import { render, waitFor } from '@testing-library/angular';

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

test('does not end up in a loop', async () => {
  await render(LoopComponent);

  await expect(
    waitFor(() => {
      expect(true).toEqual(false);
    }),
  ).rejects.toThrow();
});
