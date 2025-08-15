import { Component, ElementRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { render } from '../../src/public_api';

test('declaration specific dependencies should be available for components', async () => {
  @Component({
    selector: 'atl-test',
    standalone: true,
    template: `<div>Test</div>`,
  })
  class TestComponent {
    // @ts-expect-error - testing purpose
    private _el = inject(ElementRef);
  }

  await expect(async () => await render(TestComponent)).not.toThrow();
});

test('standalone directives imported in standalone components', async () => {
  @Component({
    selector: 'atl-test',
    standalone: true,
    imports: [NgIf],
    template: `<div *ngIf="true">Test</div>`,
  })
  class TestComponent {}

  await render(TestComponent);
});
