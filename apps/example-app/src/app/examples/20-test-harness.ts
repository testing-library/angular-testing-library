import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'atl-harness',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule],
  template: `
    <button mat-stroked-button (click)="openSnackBar()" aria-label="Show an example snack-bar">Pizza party</button>
  `,
})
export class HarnessComponent {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar() {
    return this.snackBar.open('Pizza Party!!!');
  }
}
