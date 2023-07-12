import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-standalone',
  template: `<div data-testid="standalone">Standalone Component</div>`,
  standalone: true,
})
export class StandaloneComponent {}

@Component({
  selector: 'app-standalone-with-child',
  template: `<h1>Hi {{ name }}</h1>
    <p>This has a child</p>
    <app-standalone />`,
  standalone: true,
  imports: [StandaloneComponent],
})
export class StandaloneWithChildComponent {
  @Input()
  name?: string;
}
