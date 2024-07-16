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
} from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { render, fireEvent, screen } from '../src/public_api';
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
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { 'collision-id': MockChildFixtureComponent.name },
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

  it('renders the standalone component with a mocked child', async () => {
    await render(ParentFixtureComponent, { componentImports: [MockChildFixtureComponent] });
    expect(screen.getByText('Parent fixture')).toBeInTheDocument();
    expect(screen.getByText('A mock child fixture')).toBeInTheDocument();
  });

  it('renders the standalone component with child', async () => {
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
    standalone: true,
    providers: [MySimpleService],
  })
  class NestedChildFixtureComponent {
    public constructor(public simpleService: MySimpleService) {}
  }

  @Component({
    selector: 'atl-parent-fixture',
    template: `<atl-child-fixture></atl-child-fixture>`,
    standalone: true,
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

describe('subscribeToOutputs', () => {
  @Component({ template: ``, standalone: true })
  class TestFixtureWithEventEmitterComponent {
    @Output() readonly event = new EventEmitter<void>();
  }

  @Component({ template: ``, standalone: true })
  class TestFixtureWithDerivedEventComponent {
    @Output() readonly event = fromEvent<MouseEvent>(inject(ElementRef).nativeElement, 'click');
  }

  @Component({ template: ``, standalone: true })
  class TestFixtureWithFunctionalOutputComponent {
    readonly event = output<string>();
  }

  it('should subscribe passed listener to the component EventEmitter', async () => {
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithEventEmitterComponent, { subscribeToOutputs: { event: spy } });
    fixture.componentInstance.event.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe on rerender without listener', async () => {
    const spy = jest.fn();
    const { fixture, rerender } = await render(TestFixtureWithEventEmitterComponent, {
      subscribeToOutputs: { event: spy },
    });

    await rerender({});

    fixture.componentInstance.event.emit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not unsubscribe when same listener function is used on rerender', async () => {
    const spy = jest.fn();
    const { fixture, rerender } = await render(TestFixtureWithEventEmitterComponent, {
      subscribeToOutputs: { event: spy },
    });

    await rerender({ subscribeToOutputs: { event: spy } });

    fixture.componentInstance.event.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should unsubscribe old and subscribe new listener function on rerender', async () => {
    const firstSpy = jest.fn();
    const { fixture, rerender } = await render(TestFixtureWithEventEmitterComponent, {
      subscribeToOutputs: { event: firstSpy },
    });

    const newSpy = jest.fn();
    await rerender({ subscribeToOutputs: { event: newSpy } });

    fixture.componentInstance.event.emit();

    expect(firstSpy).not.toHaveBeenCalled();
    expect(newSpy).toHaveBeenCalled();
  });

  it('should subscribe passed listener to a derived component output', async () => {
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithDerivedEventComponent, {
      subscribeToOutputs: { event: spy },
    });
    fireEvent.click(fixture.nativeElement);
    expect(spy).toHaveBeenCalled();
  });

  it('should subscribe passed listener to a functional component output', async () => {
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithFunctionalOutputComponent, {
      subscribeToOutputs: { event: spy },
    });
    fixture.componentInstance.event.emit('test');
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should subscribe passed listener to a functional derived component output', async () => {
    @Component({ template: ``, standalone: true })
    class TestFixtureWithFunctionalDerivedEventComponent {
      readonly event = outputFromObservable(fromEvent<MouseEvent>(inject(ElementRef).nativeElement, 'click'));
    }
    const spy = jest.fn();
    const { fixture } = await render(TestFixtureWithFunctionalDerivedEventComponent, {
      subscribeToOutputs: { event: spy },
    });
    fireEvent.click(fixture.nativeElement);
    expect(spy).toHaveBeenCalled();
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

  it('invokes ngOnChanges with componentProperties on initial render before ngOnInit', async () => {
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
    expect(nameChanged).toHaveBeenCalledTimes(1);
  });

  it('invokes ngOnChanges with componentInputs on initial render before ngOnInit', async () => {
    const nameInitialized = jest.fn();
    const nameChanged = jest.fn();
    const componentInput = { nameInitialized, nameChanged, name: 'Sarah' };

    const view = await render(FixtureWithNgOnChangesComponent, { componentInputs: componentInput });

    /// We wish to test the utility function from `render` here.
    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(view.getByText('Sarah')).toBeInTheDocument();
    expect(nameChanged).toHaveBeenCalledWith('Sarah', true);
    /// expect `nameChanged` to be called before `nameInitialized`
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
    standalone: true,
    selector: 'atl-fixture2',
    template: `<button>Secondary Component</button>`,
  })
  class SecondaryFixtureComponent {}

  @Component({
    standalone: true,
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
      standalone: true,
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
