import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export class Customer {
  id!: string;
  name!: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  load(): Observable<Customer[]> {
    return of([]);
  }
}

@Component({
  standalone: true,
  imports: [AsyncPipe, NgForOf],
  selector: 'atl-fixture',
  template: `
    <ul>
      <li *ngFor="let customer of customers$ | async">
        {{ customer.name }}
      </li>
    </ul>
  `,
})
export class CustomersComponent {
  private service = inject(CustomersService);
  customers$ = this.service.load();
}
