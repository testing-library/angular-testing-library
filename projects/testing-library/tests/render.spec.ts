import {
  Component,
  NgModule,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  APP_INITIALIZER,
  ApplicationInitStatus,
  Injectable,
  EventEmitter,
  Output,
  ElementRef,
  inject,
  output,
  input,
  model,
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { TestBed } from '@angular/core/testing';
import { render, fireEvent, screen, OutputRefKeysWithCallback, aliasedInput } from '../src/public_api';
import { ActivatedRoute, Resolve, RouterModule } from '@angular/router';
import { fromEvent, map } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

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

    // We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.input(view.getByTestId('input'), { target: { value: 'a super awesome input' } });
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(view.getByDisplayValue('a super awesome input')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/prefer-screen-queries
    fireEvent.click(view.getByText('button'));
  });
});

describe('components', () => {
  @Component({
    selector: 'atl-fixture',
    template: ` {{ name }} `,
  })
  class FixtureWithInputComponent {
    @Input() name = '';
  }

  it('renders component', async () => {
    await render(FixtureWithInputComponent, { componentProperties: { name: 'Bob' } });
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});

describe('component with child', () => {
  @Component({
    selector: 'atl-child-fixture',
    template: `<span>A child fixture</span>`,
  })
  class ChildFixtureComponent {}

  @Component({
    selector: 'atl-child-fixture',
    template: `<span>A mock child fixture</span>`,
    host: { 'collision-id': MockChildFixtureComponent.name },
  })
  class MockChildFixtureComponent {}

  @Component({
    selector: 'atl-parent-fixture',
    template: `<h1>Parent fixture</h1>
      <div><atl-child-fixture></atl-child-fixture></div> `,
    imports: [ChildFixtureComponent],
  })
  class ParentFixtureComponent {}

  it('renders the component with a mocked child', async () => {
    await render(ParentFixtureComponent, { componentImports: [MockChildFixtureComponent] });
    expect(screen.getByText('Parent fixture')).toBeInTheDocument();
    expect(screen.getByText('A mock child fixture')).toBeInTheDocument();
  });

  it('renders the component with child', async () => {
    await render(ParentFixtureComponent);
    expect(screen.getByText('Parent fixture')).toBeInTheDocument();
    expect(screen.getByText('A child fixture')).toBeInTheDocument();
  });

  it('rejects render of template with componentImports set', () => {
    const view = render(`<div><atl-parent-fixture></atl-parent-fixture></div>`, {
      imports: [ParentFixtureComponent],
      componentImports: [MockChildFixtureComponent],
    });
    return expect(view).rejects.toMatchObject({ message: /Error while rendering/ });
  });
});

describe('childComponentOverrides', () => {
  @Injectable()
  class MySimpleService {
    public value = 'real';
  }

  @Component({
    selector: 'atl-child-fixture',
    template: `<span>{{ simpleService.value }}</span>`,
    providers: [MySimpleService],
  })
  class NestedChildFixtureComponent {
    public constructor(public simpleService: MySimpleService) {}
  }

  @Component({
    selector: 'atl-parent-fixture',
    template: `<atl-child-fixture></atl-child-fixture>`,
    imports: [NestedChildFixtureComponent],
  })
  class ParentFixtureComponent {}

  it('renders with overridden child service when specified', async () => {
    await render(ParentFixtureComponent, {
      childComponentOverrides: [
        {
          component: NestedChildFixtureComponent,
          providers: [{ provide: MySimpleService, useValue: { value: 'fake' } }],
        },
      ],
    });

    expect(screen.getByText('fake')).toBeInTheDocument();
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

describe('componentOutputs', () => {
  it('should set passed event emitter to the component', async () => {
    @Component({ template: `` })
    class TestFixtureComponent {
      @Output() event = new EventEmitter<void>();
      emitEvent() {
        this.event.emit();
      }
    }

    const mockEmitter = new EventEmitter<void>();
    const spy = jest.spyOn(mockEmitter, 'emit');
    const { fixture } = await render(TestFixtureComponent, {
      componentOutputs: { event: mockEmitter },
    });

    fixture.componentInstance.emitEvent();

    expect(spy).toHaveBeenCalled();
  });
});

describe('on', () => {
  @Component({ template: `` })
  class TestFixtureWithEventEmitterComponent {
    @Output() readonly event = new EventEmitter<void>();
  }

  @Component({ template: `` })
  class TestFixtureWithDerivedEventComponent {
    @Output() readonly event = fromEvent<MouseEvent>(inject(ElementRef).nativeElement, 'click');
  }

  @Component({ template: `` })
  class TestFixtureWithFunctionalOutputComponent {
    readonly event = output<string>();
  }

  @Component({ template: `` })
  class TestFixtureWithFunctionalDerivedEventComponent {
    readonly event = outputFromObservable(fromEvent<MouseEvent>(inject(ElementRef).nativeElement, 'click'));
  }

  it('should subscribe passed listener to the component EventEmitter', async () => {
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithEventEmitterComponent, { on: { event: spy } });
    fixture.componentInstance.event.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe on rerender without listener', async () => {
    const spy = jest.fn();
    const { fixture, rerender } = await render(TestFixtureWithEventEmitterComponent, {
      on: { event: spy },
    });

    await rerender({});

    fixture.componentInstance.event.emit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not unsubscribe when same listener function is used on rerender', async () => {
    const spy = jest.fn();
    const { fixture, rerender } = await render(TestFixtureWithEventEmitterComponent, {
      on: { event: spy },
    });

    await rerender({ on: { event: spy } });

    fixture.componentInstance.event.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe old and subscribe new listener function on rerender', async () => {
    const firstSpy = jest.fn();
    const { fixture, rerender } = await render(TestFixtureWithEventEmitterComponent, {
      on: { event: firstSpy },
    });

    const newSpy = jest.fn();
    await rerender({ on: { event: newSpy } });

    fixture.componentInstance.event.emit();

    expect(firstSpy).not.toHaveBeenCalled();
    expect(newSpy).toHaveBeenCalled();
  });

  it('should subscribe passed listener to a derived component output', async () => {
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithDerivedEventComponent, {
      on: { event: spy },
    });
    fireEvent.click(fixture.nativeElement);
    expect(spy).toHaveBeenCalled();
  });

  it('should subscribe passed listener to a functional component output', async () => {
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithFunctionalOutputComponent, {
      on: { event: spy },
    });
    fixture.componentInstance.event.emit('test');
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should subscribe passed listener to a functional derived component output', async () => {
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithFunctionalDerivedEventComponent, {
      on: { event: spy },
    });
    fireEvent.click(fixture.nativeElement);
    expect(spy).toHaveBeenCalled();
  });

  it('OutputRefKeysWithCallback is correctly typed', () => {
    const fnWithVoidArg = (_: void) => void 0;
    const fnWithNumberArg = (_: number) => void 0;
    const fnWithStringArg = (_: string) => void 0;
    const fnWithMouseEventArg = (_: MouseEvent) => void 0;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function _test<T>(_on: OutputRefKeysWithCallback<T>) {}

    // @ts-expect-error wrong event type
    _test<TestFixtureWithEventEmitterComponent>({ event: fnWithNumberArg });
    _test<TestFixtureWithEventEmitterComponent>({ event: fnWithVoidArg });

    // @ts-expect-error wrong event type
    _test<TestFixtureWithDerivedEventComponent>({ event: fnWithNumberArg });
    _test<TestFixtureWithDerivedEventComponent>({ event: fnWithMouseEventArg });

    // @ts-expect-error wrong event type
    _test<TestFixtureWithFunctionalOutputComponent>({ event: fnWithNumberArg });
    _test<TestFixtureWithFunctionalOutputComponent>({ event: fnWithStringArg });

    // @ts-expect-error wrong event type
    _test<TestFixtureWithFunctionalDerivedEventComponent>({ event: fnWithNumberArg });
    _test<TestFixtureWithFunctionalDerivedEventComponent>({ event: fnWithMouseEventArg });

    // add a statement so the test succeeds
    expect(true).toBeTruthy();
  });
});

describe('excludeComponentDeclaration', () => {
  @Component({
    selector: 'atl-fixture',
    template: `
      <input type="text" data-testid="input" />
      <button>button</button>
    `,
    standalone: false,
  })
  class NotStandaloneFixtureComponent {}

  @NgModule({
    declarations: [NotStandaloneFixtureComponent],
  })
  class FixtureModule {}

  it('does not throw if component is declared in an imported module', async () => {
    await render(NotStandaloneFixtureComponent, {
      imports: [FixtureModule],
      excludeComponentDeclaration: true,
    });
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

  it('invokes ngOnChanges with componentProperties on initial render before ngOnInit', async () => {
    const nameInitialized = jest.fn();
    const nameChanged = jest.fn();
    const componentProperties = { nameInitialized, nameChanged, name: 'Sarah' };

    const view = await render(FixtureWithNgOnChangesComponent, { componentProperties });

    // We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(view.getByText('Sarah')).toBeInTheDocument();
    expect(nameChanged).toHaveBeenCalledWith('Sarah', true);
    // expect `nameChanged` to be called before `nameInitialized`
    expect(nameChanged.mock.invocationCallOrder[0]).toBeLessThan(nameInitialized.mock.invocationCallOrder[0]);
    expect(nameChanged).toHaveBeenCalledTimes(1);
  });

  it('invokes ngOnChanges with componentInputs on initial render before ngOnInit', async () => {
    const nameInitialized = jest.fn();
    const nameChanged = jest.fn();
    const componentInput = { nameInitialized, nameChanged, name: 'Sarah' };

    const view = await render(FixtureWithNgOnChangesComponent, { componentInputs: componentInput });

    // We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(view.getByText('Sarah')).toBeInTheDocument();
    expect(nameChanged).toHaveBeenCalledWith('Sarah', true);
    // expect `nameChanged` to be called before `nameInitialized`
    expect(nameChanged.mock.invocationCallOrder[0]).toBeLessThan(nameInitialized.mock.invocationCallOrder[0]);
    expect(nameChanged).toHaveBeenCalledTimes(1);
  });

  it('does not invoke ngOnChanges when no properties are provided', async () => {
    @Component({ template: `` })
    class TestFixtureComponent implements OnChanges {
      ngOnChanges() {
        throw new Error('should not be called');
      }
    }

    const { fixture, detectChanges } = await render(TestFixtureComponent);
    const spy = jest.spyOn(fixture.componentInstance, 'ngOnChanges');

    detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('initializer', () => {
  it('waits for angular app initialization before rendering components', async () => {
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
});

describe('DebugElement', () => {
  it('gets the DebugElement', async () => {
    const view = await render(FixtureComponent);

    expect(view.debugElement).not.toBeNull();
    expect(view.debugElement.componentInstance).toBeInstanceOf(FixtureComponent);
  });
});

describe('initialRoute', () => {
  @Component({
    selector: 'atl-fixture2',
    template: `<button>Secondary Component</button>`,
  })
  class SecondaryFixtureComponent {}

  @Component({
    selector: 'atl-router-fixture',
    template: `<router-outlet></router-outlet>`,
    imports: [RouterModule],
  })
  class RouterFixtureComponent {}

  @Injectable()
  class FixtureResolver implements Resolve<void> {
    public isResolved = false;

    public resolve() {
      this.isResolved = true;
    }
  }

  it('allows initially rendering a specific route to avoid triggering a resolver for the default route', async () => {
    const initialRoute = 'initial-route';
    const routes = [
      { path: initialRoute, component: FixtureComponent },
      { path: '**', resolve: { data: FixtureResolver }, component: SecondaryFixtureComponent },
    ];

    await render(RouterFixtureComponent, {
      initialRoute,
      routes,
      providers: [FixtureResolver],
    });
    const resolver = TestBed.inject(FixtureResolver);

    expect(resolver.isResolved).toBe(false);
    expect(screen.queryByText('Secondary Component')).not.toBeInTheDocument();
    expect(screen.getByText('button')).toBeInTheDocument();
  });

  it('allows initially rendering a specific route with query parameters', async () => {
    @Component({
      selector: 'atl-query-param-fixture',
      template: `<p>paramPresent$: {{ paramPresent$ | async }}</p>`,
      imports: [NgIf, AsyncPipe],
    })
    class QueryParamFixtureComponent {
      constructor(public route: ActivatedRoute) {}

      paramPresent$ = this.route.queryParams.pipe(map((queryParams) => (queryParams?.param ? 'present' : 'missing')));
    }

    const initialRoute = 'initial-route?param=query';
    const routes = [{ path: 'initial-route', component: QueryParamFixtureComponent }];

    await render(RouterFixtureComponent, {
      initialRoute,
      routes,
    });

    expect(screen.getByText(/present/i)).toBeVisible();
  });
});

describe('configureTestBed', () => {
  it('invokes configureTestBed', async () => {
    const configureTestBedFn = jest.fn();
    await render(FixtureComponent, {
      configureTestBed: configureTestBedFn,
    });

    expect(configureTestBedFn).toHaveBeenCalledTimes(1);
  });
});

describe('inputs and signals', () => {
  @Component({
    selector: 'atl-fixture',
    template: `<span>{{ myName() }}</span> <span>{{ myJob() }}</span>`,
  })
  class InputComponent {
    myName = input('foo');

    myJob = input('bar', { alias: 'job' });
  }

  it('should set the input component', async () => {
    await render(InputComponent, {
      inputs: {
        myName: 'Bob',
        ...aliasedInput('job', 'Builder'),
      },
    });

    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Builder')).toBeInTheDocument();
  });

  it('should typecheck correctly', async () => {
    // we only want to check the types here
    // so we are purposely not calling render

    const typeTests = [
      async () => {
        // OK:
        await render(InputComponent, {
          inputs: {
            myName: 'OK',
          },
        });
      },
      async () => {
        // @ts-expect-error - myName is a string
        await render(InputComponent, {
          inputs: {
            myName: 123,
          },
        });
      },
      async () => {
        // OK:
        await render(InputComponent, {
          inputs: {
            ...aliasedInput('job', 'OK'),
          },
        });
      },
      async () => {
        // @ts-expect-error - job is not using aliasedInput
        await render(InputComponent, {
          inputs: {
            job: 'not used with aliasedInput',
          },
        });
      },
    ];

    // add a statement so the test succeeds
    expect(typeTests).toBeTruthy();
  });
});

describe('README examples', () => {
  describe('Counter', () => {
    @Component({
      selector: 'atl-counter',
      template: `
        <span>{{ hello() }}</span>
        <button (click)="decrement()">-</button>
        <span>Current Count: {{ counter() }}</span>
        <button (click)="increment()">+</button>
      `,
    })
    class CounterComponent {
      counter = model(0);
      hello = input('Hi', { alias: 'greeting' });

      increment() {
        this.counter.set(this.counter() + 1);
      }

      decrement() {
        this.counter.set(this.counter() - 1);
      }
    }

    it('should render counter', async () => {
      await render(CounterComponent, {
        inputs: {
          counter: 5,
          ...aliasedInput('greeting', 'Hello Alias!'),
        },
      });

      expect(screen.getByText('Current Count: 5')).toBeVisible();
      expect(screen.getByText('Hello Alias!')).toBeVisible();
    });

    it('should increment the counter on click', async () => {
      await render(CounterComponent, { inputs: { counter: 5 } });

      const incrementButton = screen.getByRole('button', { name: '+' });
      fireEvent.click(incrementButton);

      expect(screen.getByText('Current Count: 6')).toBeVisible();
    });
  });
});
