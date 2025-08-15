import { Component, InjectionToken, inject } from '@angular/core';

export const DATA = new InjectionToken<{ text: string }>('Components Data');

@Component({
  standalone: true,
  selector: 'atl-fixture',
  template: ' {{ data.text }} ',
})
export class DataInjectedComponent {
  protected data = inject(DATA);
}
