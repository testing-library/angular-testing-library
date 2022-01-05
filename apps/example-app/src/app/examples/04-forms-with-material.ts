import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fixture',
  template: `
    <form [formGroup]="form" name="form">
      <mat-form-field>
        <input matInput placeholder="Name" name="name" formControlName="name" required />
      </mat-form-field>

      <mat-form-field>
        <input
          matInput
          type="number"
          placeholder="Score"
          name="score"
          formControlName="score"
          required
          min="0"
          max="10"
        />
      </mat-form-field>

      <mat-form-field>
        <mat-select placeholder="Color" name="color" formControlName="color">
          <mat-select-trigger>
            {{ colorControlDisplayValue }}
          </mat-select-trigger>
          <mat-option value="">---</mat-option>
          <mat-option *ngFor="let color of colors" [value]="color.id">{{ color.value }}</mat-option>
        </mat-select>
      </mat-form-field>

      <div role="alert" *ngIf="formErrors.length">
        <p *ngFor="let error of formErrors">{{ error }}</p>
      </div>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
      }

      form > * {
        width: 100%;
      }

      [role='alert'] {
        color: red;
      }
    `,
  ],
})
export class MaterialFormsComponent {
  colors = [
    { id: 'R', value: 'Red' },
    { id: 'B', value: 'Blue' },
    { id: 'G', value: 'Green' },
  ];
  form = this.formBuilder.group({
    name: ['', Validators.required],
    score: [0, [Validators.min(1), Validators.max(10)]],
    color: [null, Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

  get colorControlDisplayValue(): string | undefined {
    const selectedId = this.form.get('color')?.value;
    return this.colors.filter(color => color.id === selectedId)[0]?.value;
  }

  get formErrors() {
    return Object.keys(this.form.controls)
      .map((formKey) => {
        const controlErrors = this.form.get(formKey)?.errors;
        if (controlErrors) {
          return Object.keys(controlErrors).map((keyError) => {
            const error = controlErrors[keyError];
            switch (keyError) {
              case 'required':
                return `${formKey} is required`;
              case 'min':
                return `${formKey} must be greater than ${error.min}`;
              case 'max':
                return `${formKey} must be lesser than ${error.max}`;
              default:
                return `${formKey} is invalid`;
            }
          });
        }
        return [];
      })
      .reduce((errors, value) => errors.concat(value), [])
      .filter(Boolean);
  }
}
