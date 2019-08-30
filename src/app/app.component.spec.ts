import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { render } from '@testing-library/angular';
import { provideMock } from '@testing-library/angular/jest-utils';

import { AppComponent } from './app.component';
import { GreetService } from './greet.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.mode';

test(`matches snapshot`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    imports: [ReactiveFormsModule, MaterialModule],
    providers: [provideMockStore()],
  });
  expect(container).toMatchSnapshot();
});

test(`should have a title`, async () => {
  const { getByText } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    imports: [ReactiveFormsModule, MaterialModule],
    providers: [provideMockStore()],
  });
  expect(getByText('Welcome to app!')).toBeDefined();
});

test(`should render title in a h1 tag`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    imports: [ReactiveFormsModule, MaterialModule],
    providers: [provideMockStore()],
  });
  expect(container.querySelector('h1').textContent).toContain('Welcome to app!');
});

test(`should be able to get the Store`, async () => {
  await render('<app-root></app-root>', {
    declarations: [AppComponent],
    imports: [ReactiveFormsModule, MaterialModule],
    providers: [provideMockStore()],
  });
  expect(TestBed.get<Store<any>>(Store)).toBeDefined();
});

test(`should provide a mock greet service`, async () => {
  const component = await render(AppComponent, {
    declarations: [AppComponent],
    imports: [ReactiveFormsModule, MaterialModule],
    providers: [provideMockStore(), provideMock(GreetService)],
  });
  const service: GreetService = TestBed.get<GreetService>(GreetService);

  component.click(component.getByText('Greet'));

  expect(service.greet).toHaveBeenCalled();
});

describe('Forms', () => {
  test(`should have form validations`, async () => {
    const component = await render(AppComponent, {
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [provideMockStore()],
    });

    const appComponent = component.fixture.componentInstance as AppComponent;
    expect(appComponent.form.valid).toBe(false);

    const nameInput = component.getByLabelText('Name:');
    const ageInput = component.getByLabelText('Age:');
    const colorInput = component.getByLabelText('Favorite color:');
    const animalInput = component.getByLabelText('Favorite animal:');
    const carInput = component.getByLabelText(/car/);

    const nameValue = appComponent.form.get('name');
    const ageValue = appComponent.form.get('age');

    component.type(nameInput, 'B');
    expect(nameValue.valid).toBe(false);

    component.type(nameInput, 'Bob');
    expect(nameValue.valid).toBe(true);

    component.type(ageInput, '17');
    expect(ageValue.valid).toBe(false);

    component.type(ageInput, '61');
    expect(ageValue.valid).toBe(false);

    component.type(ageInput, '20');
    expect(ageValue.valid).toBe(true);

    component.selectOptions(colorInput, 'ink', { exact: false });
    component.selectOptions(colorInput, /YELLOW/i);
    component.selectOptions(animalInput, 'Cow');
    component.selectOptions(carInput, 'Audi');

    expect(appComponent.form.valid).toBe(true);
    expect(appComponent.form.value).toEqual({
      name: 'Bob',
      age: 20,
      color: 'yellow',
      animal: { name: 'Cow', sound: 'Moo!' },
      car: 'audi',
    });
  });
});
