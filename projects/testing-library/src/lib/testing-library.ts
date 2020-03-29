import { Component, Type, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FireFunction,
  FireObject,
  getQueriesForElement,
  prettyDOM,
  waitFor,
  waitForElementToBeRemoved,
  fireEvent as dtlFireEvent,
} from '@testing-library/dom';
import { RenderComponentOptions, RenderDirectiveOptions, RenderResult } from './models';
import { createSelectOptions, createType, tab } from './user-events';
@Component({ selector: 'wrapper-component', template: '' })
class WrapperComponent {}

const mountedFixtures = new Set<ComponentFixture<any>>();

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
    removeAngularAttributes = false,
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

  if (removeAngularAttributes) {
    fixture.nativeElement.removeAttribute('ng-version');
    const idAttribute = fixture.nativeElement.getAttribute('id');
    if (idAttribute && idAttribute.startsWith('root')) {
      fixture.nativeElement.removeAttribute('id');
    }
  }

  mountedFixtures.add(fixture);

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

  const eventsWithDetectChanges = Object.keys(dtlFireEvent).reduce(
    (events, key) => {
      events[key] = (element: HTMLElement, options?: {}) => {
        const result = dtlFireEvent[key](element, options);
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

  let router = routes ? TestBed.inject(Router) : null;
  const zone = TestBed.inject(NgZone);
  const navigate = async (elementOrPath: Element | string, basePath = '') => {
    if (!router) {
      router = TestBed.inject(Router);
    }

    const href = typeof elementOrPath === 'string' ? elementOrPath : elementOrPath.getAttribute('href');

    let result;
    await zone.run(() => (result = router.navigate([basePath + href])));
    detectChanges();
    return result;
  };

  function componentWaitFor<T>(
    callback,
    options: {
      container?: HTMLElement;
      timeout?: number;
      interval?: number;
      mutationObserverOptions?: {
        subtree: boolean;
        childList: boolean;
        attributes: boolean;
        characterData: boolean;
      };
    } = { container: fixture.nativeElement, interval: 50 },
  ): Promise<T> {
    const interval = setInterval(detectChanges, options.interval);
    return waitFor<T>(callback, options).finally(() => clearInterval(interval));
  }

  function componentWaitForElementToBeRemoved<T>(
    callback: () => T,
    options: {
      container?: HTMLElement;
      timeout?: number;
      interval?: number;
      mutationObserverOptions?: {
        subtree: boolean;
        childList: boolean;
        attributes: boolean;
        characterData: boolean;
      };
    } = { container: fixture.nativeElement, interval: 50 },
  ): Promise<T> {
    const interval = setInterval(detectChanges, options.interval);
    return waitForElementToBeRemoved<T>(callback, options).finally(() => clearInterval(interval));
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
    tab,
    waitFor: componentWaitFor,
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

function cleanup() {
  mountedFixtures.forEach(cleanupAtFixture);
}

function cleanupAtFixture(fixture) {
  if (!fixture.nativeElement.getAttribute('ng-version') && fixture.nativeElement.parentNode === document.body) {
    document.body.removeChild(fixture.nativeElement);
  }
  mountedFixtures.delete(fixture);
}

if (typeof afterEach === 'function' && !process.env.ATL_SKIP_AUTO_CLEANUP) {
  afterEach(async () => {
    cleanup();
  });
}

export * from '@testing-library/dom';

const fireEvent = Object.keys(dtlFireEvent).reduce(
  (events, key) => {
    events[key] = (element: HTMLElement, options?: {}) => {
      const result = dtlFireEvent[key](element, options);
      mountedFixtures.forEach(fixture => {
        fixture.detectChanges();
      });
      return result;
    };
    return events;
  },
  {} as FireFunction & FireObject,
);

export { fireEvent };
