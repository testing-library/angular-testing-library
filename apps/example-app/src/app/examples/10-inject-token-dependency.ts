import { Component, InjectionToken, Inject } from '@angular/core';

export const DATA = new InjectionToken<{ text: string }>('Components Data');

@Component({
  standalone: true,
  selector: 'app-fixture',
  template: ' {{ data.text }} ',
})
export class DataInjectedComponent {
  constructor(@Inject(DATA) public data: { text: string }) {}
}
