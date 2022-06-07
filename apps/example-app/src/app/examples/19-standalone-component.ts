import { Component } from "@angular/core";

@Component({
  selector: 'app-standalone',
  template: `<div data-testid="standalone">Standalone Component</div>`,
  standalone: true,
})
export class StandaloneComponent {}
