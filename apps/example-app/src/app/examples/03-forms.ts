import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-fixture',
  template: `
    <form [formGroup]="form" name="form">
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" formControlName="name" required />
      </div>

      <div>
        <label for="score">Score</label>
        <input type="number" id="score" name="score" formControlName="score" required min="0" max="10" />
      </div>

      <div>
        <label for="color">Color</label>
        <select id="color" name="color" formControlName="color">
          <option value="">---</option>
          <option *ngFor="let color of colors" [value]="color.id">{{ color.value }}</option>
        </select>
      </div>

      <div role="alert" *ngIf="formErrors.length">
        <p *ngFor="let error of formErrors">{{ error }}</p>
      </div>
    </form>
  `,
})
export class FormsComponent {
  colors = [
    { id: 'R', value: 'Red' },
    { id: 'B', value: 'Blue' },
    { id: 'G', value: 'Green' },
  ];
  form = this.formBuilder.group({
    name: ['', Validators.required],
    score: [0, { validators: [Validators.min(1), Validators.max(10)], updateOn: 'blur' }],
    color: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

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
