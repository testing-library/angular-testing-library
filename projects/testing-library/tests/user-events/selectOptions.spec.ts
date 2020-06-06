import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { render, RenderResult } from '../../src/public_api';
import { Component, ViewChild, Input } from '@angular/core';

describe('selectOption: single', () => {
  test('with a template-driven form', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" [(ngModel)]="value">
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ value }}</p>
      `,
    })
    class FixtureComponent {
      value: string;
    }

    const component = await render(FixtureComponent, {
      imports: [FormsModule],
    });

    assertSelectOptions(component, () => component.fixture.componentInstance.value);
  });

  test('with a reactive form', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" [formControl]="value">
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ value.value }}</p>
      `,
    })
    class FixtureComponent {
      value = new FormControl('');
    }

    const component = await render(FixtureComponent, {
      imports: [ReactiveFormsModule],
    });

    assertSelectOptions(component, () => component.fixture.componentInstance.value.value);
  });

  test('with change event', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" (change)="onChange($event)">
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ value }}</p>
      `,
    })
    class FixtureComponent {
      value = '';

      onChange(event: KeyboardEvent) {
        this.value = (<HTMLInputElement>event.target).value;
      }
    }

    const component = await render(FixtureComponent);

    assertSelectOptions(component, () => component.fixture.componentInstance.value);
  });

  test('by reference', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" #input>
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ input.value }}</p>
      `,
    })
    class FixtureComponent {
      @ViewChild('input', { static: false }) value;
    }

    const component = await render(FixtureComponent);

    assertSelectOptions(component, () => component.fixture.componentInstance.value.nativeElement.value);
  });

  function assertSelectOptions(component: RenderResult<any>, value: () => string) {
    const inputControl = component.getByTestId('select') as HTMLSelectElement;
    component.selectOptions(inputControl, /apples/i);
    component.selectOptions(inputControl, 'Oranges');

    expect(value()).toBe('2');
    expect(component.getByTestId('text').textContent).toBe('2');
    expect(inputControl.value).toBe('2');

    expect((component.getByTestId('apples') as HTMLOptionElement).selected).toBe(false);
    expect((component.getByTestId('oranges') as HTMLOptionElement).selected).toBe(true);
    expect((component.getByTestId('lemons') as HTMLOptionElement).selected).toBe(false);
  }
});

describe('selectOption: multiple', () => {
  test('with a template-driven form', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" multiple [(ngModel)]="value">
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ value }}</p>
      `,
    })
    class FixtureComponent {
      value: string[];
    }

    const component = await render(FixtureComponent, {
      imports: [FormsModule],
    });
    assertSelectOptions(component, () => component.fixture.componentInstance.value);
  });

  test('with a reactive form', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" multiple [formControl]="value">
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ value.value }}</p>
      `,
    })
    class FixtureComponent {
      value = new FormControl('');
    }

    const component = await render(FixtureComponent, {
      imports: [ReactiveFormsModule],
    });

    assertSelectOptions(component, () => component.fixture.componentInstance.value.value);
  });

  test('with change event', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" multiple (change)="onChange($event)">
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ value }}</p>
      `,
    })
    class FixtureComponent {
      value = [];

      onChange(event: KeyboardEvent) {
        this.value = Array.from((<HTMLSelectElement>event.target).selectedOptions).map((o) => o.value);
      }
    }

    const component = await render(FixtureComponent);

    assertSelectOptions(component, () => component.fixture.componentInstance.value);
  });

  test('by reference', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <select data-testid="select" multiple #input>
          <option value="1" data-testid="apples">Apples</option>
          <option value="2" data-testid="oranges">Oranges</option>
          <option value="3" data-testid="lemons">Lemons</option>
        </select>

        <p data-testid="text">{{ input.value }}</p>
      `,
    })
    class FixtureComponent {
      @ViewChild('input', { static: false }) value;
    }

    const component = await render(FixtureComponent);

    const inputControl = component.getByTestId('select') as HTMLSelectElement;
    component.selectOptions(inputControl, /apples/i);
    component.selectOptions(inputControl, ['Oranges', 'Lemons']);

    const options = component.fixture.componentInstance.value.nativeElement.selectedOptions;
    const value = Array.from(options).map((o: any) => o.value);

    expect(value).toEqual(['2', '3']);
    // shouldn't this be an empty string? - https://stackblitz.com/edit/angular-pdvm9n
    expect(component.getByTestId('text').textContent).toBe('2');
    expect((component.getByTestId('apples') as HTMLOptionElement).selected).toBe(false);
    expect((component.getByTestId('oranges') as HTMLOptionElement).selected).toBe(true);
    expect((component.getByTestId('lemons') as HTMLOptionElement).selected).toBe(true);
  });

  function assertSelectOptions(component: RenderResult<any>, value: () => string[]) {
    const inputControl = component.getByTestId('select') as HTMLSelectElement;
    component.selectOptions(inputControl, /apples/i);
    component.selectOptions(inputControl, ['Oranges', 'Lemons']);

    expect(value()).toEqual(['2', '3']);
    expect(component.getByTestId('text').textContent).toBe('2,3');
    expect((component.getByTestId('apples') as HTMLOptionElement).selected).toBe(false);
    expect((component.getByTestId('oranges') as HTMLOptionElement).selected).toBe(true);
    expect((component.getByTestId('lemons') as HTMLOptionElement).selected).toBe(true);
  }
});
