import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { render, RenderResult } from '../../src/public_api';
import { Component, ViewChild, Input } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

describe('updates the value', () => {
  test('with a template-driven form', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <input type="text" [(ngModel)]="value" data-testid="input" />
        <p data-testid="text">{{ value }}</p>
      `,
    })
    class FixtureComponent {
      value: string;
    }

    const component = await render(FixtureComponent, {
      imports: [FormsModule],
    });

    assertType(component, () => component.fixture.componentInstance.value);
  });

  test('with a reactive form', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <input type="text" [formControl]="value" data-testid="input" />
        <p data-testid="text">{{ value.value }}</p>
      `,
    })
    class FixtureComponent {
      value = new FormControl('');
    }

    const component = await render(FixtureComponent, {
      imports: [ReactiveFormsModule],
    });

    assertType(component, () => component.fixture.componentInstance.value.value);
  });

  test('with events', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <input type="text" (input)="onInput($event)" data-testid="input" />
        <p data-testid="text">{{ value }}</p>
      `,
    })
    class FixtureComponent {
      value = '';

      onInput(event: KeyboardEvent) {
        this.value = (<HTMLInputElement>event.target).value;
      }
    }

    const component = await render(FixtureComponent);

    assertType(component, () => component.fixture.componentInstance.value);
  });

  test('by reference', async () => {
    @Component({
      selector: 'fixture',
      template: `
        <input type="text" data-testid="input" #input />
        <p data-testid="text">{{ input.value }}</p>
      `,
    })
    class FixtureComponent {
      @ViewChild('input', { static: false }) value;
    }

    const component = await render(FixtureComponent);

    assertType(component, () => component.fixture.componentInstance.value.nativeElement.value);
  });

  function assertType(component: RenderResult<any>, value: () => string) {
    const input = '@testing-library/angular';
    const inputControl = component.getByTestId('input') as HTMLInputElement;
    component.type(inputControl, input);

    expect(value()).toBe(input);
    expect(component.getByTestId('text').textContent).toBe(input);
    expect(inputControl.value).toBe(input);
    expect(inputControl).toHaveProperty('value', input);
  }
});

describe('options', () => {
  @Component({
    selector: 'fixture',
    template: `
      <input
        type="text"
        data-testid="input"
        (input)="onInput($event)"
        (change)="onChange($event)"
        (keydown)="onKeyDown($event)"
        (keypress)="onKeyPress($event)"
        (keyup)="onKeyUp($event)"
      />
    `,
  })
  class FixtureComponent {
    onInput($event) {}
    onChange($event) {}
    onKeyDown($event) {}
    onKeyPress($event) {}
    onKeyUp($event) {}
  }

  async function setup() {
    const componentProperties = {
      onInput: jest.fn(),
      onChange: jest.fn(),
      onKeyDown: jest.fn(),
      onKeyPress: jest.fn(),
      onKeyUp: jest.fn(),
    };
    const component = await render(FixtureComponent, { componentProperties });

    return { component, ...componentProperties };
  }

  describe('allAtOnce', () => {
    test('false: updates the value one char at a time', async () => {
      const { component, onInput, onChange, onKeyDown, onKeyPress, onKeyUp } = await setup();

      const inputControl = component.getByTestId('input') as HTMLInputElement;
      const inputValue = 'foobar';
      component.type(inputControl, inputValue);

      expect(onInput).toBeCalledTimes(inputValue.length);
      expect(onKeyDown).toBeCalledTimes(inputValue.length);
      expect(onKeyPress).toBeCalledTimes(inputValue.length);
      expect(onKeyUp).toBeCalledTimes(inputValue.length);

      component.blur(inputControl);
      expect(onChange).toBeCalledTimes(1);
    });

    test('true: updates the value in one time and does not trigger other events', async () => {
      const { component, onInput, onChange, onKeyDown, onKeyPress, onKeyUp } = await setup();

      const inputControl = component.getByTestId('input') as HTMLInputElement;
      const inputValue = 'foobar';
      component.type(inputControl, inputValue, { allAtOnce: true });

      expect(onInput).toBeCalledTimes(1);
      expect(onKeyDown).toBeCalledTimes(0);
      expect(onKeyPress).toBeCalledTimes(0);
      expect(onKeyUp).toBeCalledTimes(0);

      component.blur(inputControl);
      expect(onChange).toBeCalledTimes(1);
    });
  });

  describe('delay', () => {
    test('delays the input', fakeAsync(async () => {
      const { component } = await setup();

      const inputControl = component.getByTestId('input') as HTMLInputElement;
      const inputValue = 'foobar';
      component.type(inputControl, inputValue, { delay: 25 });

      [...inputValue].forEach((_, i) => {
        expect(inputControl.value).toBe(inputValue.substr(0, i));
        tick(25);
      });
    }));
  });
});

describe('does not type when ', () => {
  @Component({
    selector: 'fixture',
    template: `
      <input
        type="text"
        data-testid="input"
        [disabled]="disabled"
        [readonly]="readonly"
        (input)="onInput($event)"
        (change)="onChange($event)"
        (keydown)="onKeyDown($event)"
        (keypress)="onKeyPress($event)"
        (keyup)="onKeyUp($event)"
      />
    `,
  })
  class FixtureComponent {
    @Input() disabled = false;
    @Input() readonly = false;

    onInput($event) {}
    onChange($event) {}
    onKeyDown($event) {}
    onKeyPress($event) {}
    onKeyUp($event) {}
  }

  test('input is disabled', async () => {
    const componentEvents = {
      onInput: jest.fn(),
      onChange: jest.fn(),
      onKeyDown: jest.fn(),
      onKeyPress: jest.fn(),
      onKeyUp: jest.fn(),
    };

    const component = await render(FixtureComponent, {
      componentProperties: {
        disabled: true,
        ...componentEvents,
      },
    });

    const inputControl = component.getByTestId('input') as HTMLInputElement;
    component.type(inputControl, 'Hello');

    Object.values(componentEvents).forEach((evt) => expect(evt).not.toHaveBeenCalled());
    expect(inputControl.value).toBe('');
  });

  test('input is readonly', async () => {
    const componentEvents = {
      onInput: jest.fn(),
      onChange: jest.fn(),
      onKeyDown: jest.fn(),
      onKeyPress: jest.fn(),
      onKeyUp: jest.fn(),
    };

    const component = await render(FixtureComponent, {
      componentProperties: {
        readonly: true,
        ...componentEvents,
      },
    });

    const inputControl = component.getByTestId('input') as HTMLInputElement;
    const value = 'Hello';
    component.type(inputControl, value);

    expect(componentEvents.onInput).not.toHaveBeenCalled();
    expect(componentEvents.onChange).not.toHaveBeenCalled();
    expect(componentEvents.onKeyDown).toHaveBeenCalledTimes(value.length);
    expect(componentEvents.onKeyPress).toHaveBeenCalledTimes(value.length);
    expect(componentEvents.onKeyUp).toHaveBeenCalledTimes(value.length);
    expect(inputControl.value).toBe('');
  });

  test('event.preventDefault() is called', async () => {
    const componentProperties = {
      onChange: jest.fn(),
      onKeyDown: jest.fn().mockImplementation((event) => event.preventDefault()),
    };

    const component = await render(FixtureComponent, { componentProperties });

    const inputControl = component.getByTestId('input') as HTMLInputElement;
    const inputValue = 'foobar';
    component.type(inputControl, inputValue);

    expect(componentProperties.onKeyDown).toHaveBeenCalledTimes(inputValue.length);

    component.blur(inputControl);
    expect(componentProperties.onChange).toBeCalledTimes(0);

    expect(inputControl.value).toBe('');
  });
});

test('can clear an input field', async () => {
  @Component({
    selector: 'fixture',
    template: ` <input type="text" data-testid="input" [value]="initialValue" /> `,
  })
  class FixtureComponent {
    @Input() initialValue = '';
  }

  const component = await render(FixtureComponent, {
    componentProperties: {
      initialValue: 'an initial value',
    },
  });

  const inputControl = component.getByTestId('input') as HTMLInputElement;
  expect(inputControl.value).toBe('an initial value');

  component.type(inputControl, '');
  expect(inputControl.value).toBe('');
});
