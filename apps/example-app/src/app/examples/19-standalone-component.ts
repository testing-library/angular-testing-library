import { Component, Input } from '@angular/core';

@Component({
  selector: 'atl-standalone',
  template: `<div data-testid="standalone">Standalone Component</div>`,
  standalone: true,
})
export class StandaloneComponent {}

@Component({
  selector: 'atl-standalone-with-child',
  template: `<h1>Hi {{ name }}</h1>
    <p>This has a child</p>
    <atl-standalone />`,
  standalone: true,
  imports: [StandaloneComponent],
})
export class StandaloneWithChildComponent {
  @Input()
  name?: string;
}
