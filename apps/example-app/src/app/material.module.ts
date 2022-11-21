import { NgModule } from '@angular/core';

import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  exports: [MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
})
export class MaterialModule {}
