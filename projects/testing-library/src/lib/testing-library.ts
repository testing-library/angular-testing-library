import { Component, ElementRef, OnInit, Type, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  fireEvent,
  FireFunction,
  FireObject,
  getQueriesForElement,
  prettyDOM,
  waitForDomChange,
  waitForElement,
  waitForElementToBeRemoved,
} from '@testing-library/dom';
import { RenderComponentOptions, RenderDirectiveOptions, RenderResult } from './models';
import { createSelectOptions, createType } from './user-events';

@Component({ selector: 'wrapper-component', template: '' })
class WrapperComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
}

export async function render<ComponentType>(
  component: Type<ComponentType>,
  renderOptions?: RenderComponentOptions<ComponentType>,
): Promise<RenderResult<ComponentType, ComponentType>>;
export async function render<DirectiveType, WrapperType = WrapperComponent>(
  component: Type<DirectiveType>,
  renderOptions?: RenderDirectiveOptions<DirectiveType, WrapperType>,
): Promise<RenderResult<DirectiveType, WrapperType>>;

export async function render<SutType, WrapperType = SutType>(
  sut: Type<SutType>,
  renderOptions: RenderComponentOptions<SutType> | RenderDirectiveOptions<SutType, WrapperType> = {},
): Promise<RenderResult<SutType>> {
  const {
    detectChanges: detectChangesOnRender = true,
    declarations = [],
    imports = [],
    providers = [],
    schemas = [],
    queries,
    template,
    wrapper = WrapperComponent,
    componentProperties = {},
    componentProviders = [],
    excludeComponentDeclaration = false,
    routes,
  } = renderOptions as RenderDirectiveOptions<SutType, WrapperType>;

  TestBed.configureTestingModule({
    declarations: addAutoDeclarations(sut, { declarations, excludeComponentDeclaration, template, wrapper }),
    imports: addAutoImports({ imports, routes }),
    providers: [...providers],
    schemas: [...schemas],
  });

  if (componentProviders) {
    componentProviders
      .reduce((acc, provider) => acc.concat(provider), [])
      .forEach(p => {
        const { provide, ...provider } = p;
        TestBed.overrideProvider(provide, provider);
      });
  }

  const fixture = createComponentFixture(sut, { template, wrapper });
  setComponentProperties(fixture, { componentProperties });

  await TestBed.compileComponents();

  let isAlive = true;
  fixture.componentRef.onDestroy(() => (isAlive = false));

  function detectChanges() {
    if (isAlive) {
      fixture.detectChanges();
    }
  }

  if (detectChangesOnRender) {
    detectChanges();
  }

  const eventsWithDetectChanges = Object.keys(fireEvent).reduce(
    (events, key) => {
      events[key] = (element: HTMLElement, options?: {}) => {
        const result = fireEvent[key](element, options);
        detectChanges();
        return result;
      };
      return events;
    },
    {} as FireFunction & FireObject,
  );

  const rerender = (rerenderedProperties: Partial<SutType>) => {
    setComponentProperties(fixture, { componentProperties: rerenderedProperties });
    detectChanges();
  };

  let router = routes ? (TestBed.get<Router>(Router) as Router) : null;
  const zone = TestBed.get<NgZone>(NgZone) as NgZone;
  const navigate = async (elementOrPath: Element | string, basePath = '') => {
    if (!router) {
      router = TestBed.get<Router>(Router) as Router;
    }

    const href = typeof elementOrPath === 'string' ? elementOrPath : elementOrPath.getAttribute('href');

    let result;
    await zone.run(() => (result = router.navigate([basePath + href])));
    detectChanges();
    return result;
  };

  function componentWaitForDomChange<Result>(options?: {
    container?: HTMLElement;
    timeout?: number;
    mutationObserverOptions?: MutationObserverInit;
  }): Promise<Result> {
    const interval = setInterval(detectChanges, 10);
    return waitForDomChange<Result>({ container: fixture.nativeElement, ...options }).finally(() =>
      clearInterval(interval),
    );
  }

  function componentWaitForElement<Result>(
    callback: () => Result,
    options?: {
      container?: HTMLElement;
      timeout?: number;
      mutationObserverOptions?: MutationObserverInit;
    },
  ): Promise<Result> {
    const interval = setInterval(detectChanges, 10);
    return waitForElement(callback, { container: fixture.nativeElement, ...options }).finally(() =>
      clearInterval(interval),
    );
  }

  function componentWaitForElementToBeRemoved<Result>(
    callback: () => Result,
    options?: {
      container?: HTMLElement;
      timeout?: number;
      mutationObserverOptions?: MutationObserverInit;
    },
  ): Promise<Result> {
    const interval = setInterval(detectChanges, 10);
    return waitForElementToBeRemoved(callback, { container: fixture.nativeElement, ...options }).finally(() =>
      clearInterval(interval),
    );
  }

  return {
    fixture,
    detectChanges,
    navigate,
    rerender,
    debugElement: fixture.debugElement.query(By.directive(sut)),
    container: fixture.nativeElement,
    debug: (element = fixture.nativeElement) => console.log(prettyDOM(element)),
    type: createType(eventsWithDetectChanges),
    selectOptions: createSelectOptions(eventsWithDetectChanges),
    waitForDomChange: componentWaitForDomChange,
    waitForElement: componentWaitForElement,
    waitForElementToBeRemoved: componentWaitForElementToBeRemoved,
    ...getQueriesForElement(fixture.nativeElement, queries),
    ...eventsWithDetectChanges,
  };
}

function createComponentFixture<SutType>(
  component: Type<SutType>,
  { template, wrapper }: Pick<RenderDirectiveOptions<SutType, any>, 'template' | 'wrapper'>,
): ComponentFixture<SutType> {
  if (template) {
    TestBed.overrideTemplate(wrapper, template);
    return TestBed.createComponent(wrapper);
  }
  return TestBed.createComponent(component);
}

function setComponentProperties<SutType>(
  fixture: ComponentFixture<SutType>,
  { componentProperties = {} }: Pick<RenderDirectiveOptions<SutType, any>, 'componentProperties'>,
) {
  for (const key of Object.keys(componentProperties)) {
    fixture.componentInstance[key] = componentProperties[key];
  }
  return fixture;
}

function addAutoDeclarations<SutType>(
  component: Type<SutType>,
  {
    declarations,
    excludeComponentDeclaration,
    template,
    wrapper,
  }: Pick<
    RenderDirectiveOptions<SutType, any>,
    'declarations' | 'excludeComponentDeclaration' | 'template' | 'wrapper'
  >,
) {
  const wrappers = () => {
    return template ? [wrapper] : [];
  };

  const components = () => {
    return excludeComponentDeclaration ? [] : [component];
  };

  return [...declarations, ...wrappers(), ...components()];
}

function addAutoImports({ imports, routes }: Pick<RenderComponentOptions<any>, 'imports' | 'routes'>) {
  const animations = () => {
    const animationIsDefined =
      imports.indexOf(NoopAnimationsModule) > -1 || imports.indexOf(BrowserAnimationsModule) > -1;
    return animationIsDefined ? [] : [NoopAnimationsModule];
  };

  const routing = () => {
    return routes ? [RouterTestingModule.withRoutes(routes)] : [];
  };

  return [...imports, ...animations(), ...routing()];
}
