import { Component, NgModule, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { render, configure } from '../src/public_api';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'fixture',
  template: `
    <input type="text" data-testid="input" />
    <button>button</button>
  `,
})
class FixtureComponent {}

test('creates queries and events', async () => {
  const component = await render(FixtureComponent);

  component.input(component.getByTestId('input'), { target: { value: 'a super awesome input' } });
  component.getByDisplayValue('a super awesome input');
  component.click(component.getByText('button'));
});

describe('removeAngularAttributes', () => {
  test('should remove angular attribute', async () => {
    await render(FixtureComponent, {
      removeAngularAttributes: true,
    });

    expect(document.querySelector('[ng-version]')).toBeNull();
    expect(document.querySelector('[id]')).toBeNull();
  });

  test('is disabled by default', async () => {
    await render(FixtureComponent, {
      removeAngularAttributes: false,
    });

    expect(document.querySelector('[ng-version]')).not.toBeNull();
    expect(document.querySelector('[id]')).not.toBeNull();
  });
});

describe('animationModule', () => {
  @NgModule({
    declarations: [FixtureComponent],
  })
  class FixtureModule {}
  describe('excludeComponentDeclaration', () => {
    test('will throw if component is declared in an import', async () => {
      await render(FixtureComponent, {
        imports: [FixtureModule],
        excludeComponentDeclaration: true,
      });
    });
  });

  test('adds NoopAnimationsModule by default', async () => {
    await render(FixtureComponent);
    const noopAnimationsModule = TestBed.inject(NoopAnimationsModule);
    expect(noopAnimationsModule).toBeDefined();
  });

  test('does not add NoopAnimationsModule if BrowserAnimationsModule is an import', async () => {
    await render(FixtureComponent, {
      imports: [BrowserAnimationsModule],
    });

    const browserAnimationsModule = TestBed.inject(BrowserAnimationsModule);
    expect(browserAnimationsModule).toBeDefined();

    expect(() => TestBed.inject(NoopAnimationsModule)).toThrow();
  });
});

describe('Angular component life-cycle hooks', () => {
  @Component({
    selector: 'fixture',
    template: ` {{ name }} `,
  })
  class FixtureWithNgOnChangesComponent implements OnInit, OnChanges {
    @Input() name = 'Sarah';
    @Input() nameInitialized?: (name: string) => void;
    @Input() nameChanged?: (name: string, isFirstChange: boolean) => void;

    ngOnInit() {
      if (this.nameInitialized) {
        this.nameInitialized(this.name);
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.name && this.nameChanged) {
        this.nameChanged(changes.name.currentValue, changes.name.isFirstChange());
      }
    }
  }

  test('will call ngOnInit on initial render', async () => {
    const nameInitialized = jest.fn();
    const componentProperties = { nameInitialized };
    const component = await render(FixtureWithNgOnChangesComponent, { componentProperties });

    component.getByText('Sarah');
    expect(nameInitialized).toBeCalledWith('Sarah');
  });

  test('will call ngOnChanges on initial render before ngOnInit', async () => {
    const nameInitialized = jest.fn();
    const nameChanged = jest.fn();
    const componentProperties = { nameInitialized, nameChanged };
    const component = await render(FixtureWithNgOnChangesComponent, { componentProperties });

    component.getByText('Sarah');
    expect(nameChanged).toBeCalledWith('Sarah', true);
    // expect `nameChanged` to be called before `nameInitialized`
    expect(nameChanged.mock.invocationCallOrder[0]).toBeLessThan(nameInitialized.mock.invocationCallOrder[0]);
  });
});

describe('configure: default imports', () => {
  @Component({
    selector: 'app-fixture',
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
});
