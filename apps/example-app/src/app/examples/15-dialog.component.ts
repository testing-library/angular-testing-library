import { Component, NgModule } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-overview-example',
  template: '<button (click)="openDialog()">Open dialog</button>',
})
export class DialogComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    this.dialog.open(DialogContentComponent);
  }
}

@Component({
  selector: 'app-dialog-overview-example-dialog',
  template: `
    <h1 mat-dialog-title>Dialog Title</h1>
    <div mat-dialog-content>Dialog content</div>
    <div mat-dialog-actions>
      <button (click)="cancel()">Cancel</button>
      <button mat-dialog-close="OK">Ok</button>
    </div>
  `,
})
export class DialogContentComponent {
  constructor(public dialogRef: MatDialogRef<DialogContentComponent>) {}

  cancel(): void {
    this.dialogRef.close();
  }
}

@NgModule({
  declarations: [DialogContentComponent],
})
export class DialogContentComponentModule {}
