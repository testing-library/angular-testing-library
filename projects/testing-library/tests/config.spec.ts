import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render, configure, Config } from '../src/public_api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'atl-fixture',
  template: `
    <form [formGroup]="form" name="form">
      <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" formControlName="name" />
      </div>
    </form>
  `,
})
class FormsComponent {
  form = this.formBuilder.group({
    name: [''],
  });

  constructor(private formBuilder: FormBuilder) {}
}

let originalConfig: Config;
beforeEach(() => {
  // Grab the existing configuration so we can restore
  // it at the end of the test
  configure((existingConfig) => {
    originalConfig = existingConfig as Config;
    // Don't change the existing config
    return {};
  });
});

afterEach(() => {
  configure(originalConfig);
});

beforeEach(() => {
  configure({
    defaultImports: [ReactiveFormsModule],
  });
});

test('adds default imports to the testbed', async () => {
  await render(FormsComponent);

  const reactive = TestBed.inject(ReactiveFormsModule);
  expect(reactive).not.toBeNull();
});
