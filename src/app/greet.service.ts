import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GreetService {
  greet(): void {
    console.log('👋👋');
  }
}
