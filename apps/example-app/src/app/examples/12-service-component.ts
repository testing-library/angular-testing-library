import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, Injectable } from '@angular/core';
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
  customers$ = this.service.load();
  constructor(private service: CustomersService) {}
}
