import { NgModule } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  exports: [MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule],
})
export class MaterialModule {}
