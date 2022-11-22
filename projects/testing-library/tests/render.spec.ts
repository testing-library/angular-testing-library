import {
  Component,
  NgModule,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  APP_INITIALIZER,
  ApplicationInitStatus,
} from '@angular/core';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { render, fireEvent, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: `
    <input type="text" data-testid="input" />
    <button>button</button>
  `,
})
class FixtureComponent {}

describe('DTL functionality', () => {
  it('creates queries and events', async () => {
    const view = await render(FixtureComponent);

    /// We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.input(view.getByTestId('input'), { target: { value: 'a super awesome input' } });
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(view.getByDisplayValue('a super awesome input')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.click(view.getByText('button'));
  });
});

describe('standalone', () => {
  @Component({
    selector: 'atl-fixture',
    template: ` {{ name }} `,
  })
  class StandaloneFixtureComponent {
    @Input() name = '';
  }

  it('renders standalone component', async () => {
    await render(StandaloneFixtureComponent, { componentProperties: { name: 'Bob' } });
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});

describe('standalone with child', () => {
  @Component({
    selector: 'atl-child-fixture',
    template: `<span>A child fixture</span>`,
    standalone: true,
  })
  class ChildFixtureComponent {}

  @Component({
    selector: 'atl-child-fixture',
    template: `<span>A mock child fixture</span>`,
    standalone: true,
  })
  class MockChildFixtureComponent {}

  @Component({
    selector: 'atl-parent-fixture',
    template: `<h1>Parent fixture</h1>
      <div><atl-child-fixture></atl-child-fixture></div> `,
    standalone: true,
    imports: [ChildFixtureComponent],
  })
  class ParentFixtureComponent {}

  it('renders the standalone component with child', async () => {
    await render(ParentFixtureComponent);
    expect(screen.getByText('Parent fixture')).toBeInTheDocument();
    expect(screen.getByText('A child fixture')).toBeInTheDocument();
  });

  it('renders the standalone component with a mocked child', async () => {
    await render(ParentFixtureComponent, { componentImports: [MockChildFixtureComponent] });
    expect(screen.getByText('Parent fixture')).toBeInTheDocument();
    expect(screen.getByText('A mock child fixture')).toBeInTheDocument();
  });

  it('rejects render of template with componentImports set', () => {
    const view = render(`<div><atl-parent-fixture></atl-parent-fixture></div>`, {
      imports: [ParentFixtureComponent],
      componentImports: [MockChildFixtureComponent],
    });
    return expect(view).rejects.toMatchObject({ message: /Error while rendering/ });
  });
});

describe('removeAngularAttributes', () => {
  it('should remove angular attribute', async () => {
    await render(FixtureComponent, {
      removeAngularAttributes: true,
    });

    expect(document.querySelector('[ng-version]')).toBeNull();
    expect(document.querySelector('[id]')).toBeNull();
  });

  it('is disabled by default', async () => {
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
    it('does not throw if component is declared in an imported module', async () => {
      await render(FixtureComponent, {
        imports: [FixtureModule],
        excludeComponentDeclaration: true,
      });
    });
  });

  it('adds NoopAnimationsModule by default', async () => {
    await render(FixtureComponent);
    const noopAnimationsModule = TestBed.inject(NoopAnimationsModule);
    expect(noopAnimationsModule).toBeDefined();
  });

  it('does not add NoopAnimationsModule if BrowserAnimationsModule is an import', async () => {
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
    selector: 'atl-fixture',
    template: ` {{ name }} `,
  })
  class FixtureWithNgOnChangesComponent implements OnInit, OnChanges {
    @Input() name = 'Initial';
    @Input() nameInitialized?: (name: string) => void;
    @Input() nameChanged?: (name: string, isFirstChange: boolean) => void;

    ngOnInit() {
      if (this.nameInitialized) {
        this.nameInitialized(this.name);
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (this.nameChanged) {
        this.nameChanged(changes.name?.currentValue, changes.name?.isFirstChange());
      }
    }
  }

  it('invokes ngOnInit on initial render', async () => {
    const nameInitialized = jest.fn();
    const componentProperties = { nameInitialized };
    const view = await render(FixtureWithNgOnChangesComponent, { componentProperties });

    /// We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(view.getByText('Initial')).toBeInTheDocument();
    expect(nameInitialized).toHaveBeenCalledWith('Initial');
  });

  it('invokes ngOnChanges on initial render before ngOnInit', async () => {
    const nameInitialized = jest.fn();
    const nameChanged = jest.fn();
    const componentProperties = { nameInitialized, nameChanged, name: 'Sarah' };

    const view = await render(FixtureWithNgOnChangesComponent, { componentProperties });

    /// We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(view.getByText('Sarah')).toBeInTheDocument();
    expect(nameChanged).toHaveBeenCalledWith('Sarah', true);
    /// expect `nameChanged` to be called before `nameInitialized`
    expect(nameChanged.mock.invocationCallOrder[0]).toBeLessThan(nameInitialized.mock.invocationCallOrder[0]);
  });

  it('does not invoke ngOnChanges when no properties are provided', async () => {
    @Component({ template: `` })
    class TestFixtureComponent implements OnChanges {
      ngOnChanges() {
        throw new Error('should not be called');
      }
    }

    await render(TestFixtureComponent);
  });
});

test('waits for angular app initialization before rendering components', async () => {
  const mock = jest.fn();

  await render(FixtureComponent, {
    providers: [
      {
        provide: APP_INITIALIZER,
        useFactory: () => mock,
        multi: true,
      },
    ],
  });

  expect(TestBed.inject(ApplicationInitStatus).done).toBe(true);
  expect(mock).toHaveBeenCalled();
});

test('gets the DebugElement', async () => {
  const view = await render(FixtureComponent);

  expect(view.debugElement).not.toBeNull();
  expect(view.debugElement.componentInstance).toBeInstanceOf(FixtureComponent);
});
