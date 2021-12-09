import {
  ChangeDetectorRef,
  Component,
  Type,
  NgZone,
  SimpleChange,
  OnChanges,
  SimpleChanges,
  ApplicationInitStatus,
} from '@angular/core';
import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationExtras, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  getQueriesForElement as dtlGetQueriesForElement,
  prettyDOM as dtlPrettyDOM,
  waitFor as dtlWaitFor,
  waitForElementToBeRemoved as dtlWaitForElementToBeRemoved,
  screen as dtlScreen,
  within as dtlWithin,
  waitForOptions as dtlWaitForOptions,
  configure as dtlConfigure,
  Queries,
  getQueriesForElement,
  queries as dtlQueries,
} from '@testing-library/dom';
import { RenderComponentOptions, RenderTemplateOptions, RenderResult } from './models';
import { getConfig } from './config';

const mountedFixtures = new Set<ComponentFixture<any>>();
const inject = TestBed.inject || TestBed.get;

export async function render<ComponentType>(
  component: Type<ComponentType>,
  renderOptions?: RenderComponentOptions<ComponentType>,
): Promise<RenderResult<ComponentType, ComponentType>>;
export async function render<WrapperType = WrapperComponent>(
  template: string,
  renderOptions?: RenderTemplateOptions<WrapperType>,
): Promise<RenderResult<WrapperType>>;

export async function render<SutType, WrapperType = SutType>(
  sut: Type<SutType> | string,
  renderOptions: RenderComponentOptions<SutType> | RenderTemplateOptions<WrapperType> = {},
): Promise<RenderResult<SutType>> {
  const { dom: domConfig, ...globalConfig } = getConfig();
  const {
    detectChanges: detectChangesOnRender = true,
    declarations = [],
    imports = [],
    providers = [],
    schemas = [],
    queries,
    wrapper = WrapperComponent as Type<WrapperType>,
    componentProperties = {},
    componentProviders = [],
    excludeComponentDeclaration = false,
    routes,
    removeAngularAttributes = false,
    defaultImports = [],
  } = { ...globalConfig, ...renderOptions };

  dtlConfigure({
    eventWrapper: (cb) => {
      const result = cb();
      detectChangesForMountedFixtures();
      return result;
    },
    ...domConfig,
  });

  TestBed.configureTestingModule({
    declarations: addAutoDeclarations(sut, {
      declarations,
      excludeComponentDeclaration,
      wrapper,
    }),
    imports: addAutoImports({
      imports: imports.concat(defaultImports),
      routes,
    }),
    providers: [...providers],
    schemas: [...schemas],
  });

  await TestBed.compileComponents();

  componentProviders
    .reduce((acc, provider) => acc.concat(provider), [] as any[])
    .forEach((p: any) => {
      const { provide, ...provider } = p;
      TestBed.overrideProvider(provide, provider);
    });

  const componentContainer = createComponentFixture(sut, wrapper);

  let fixture: ComponentFixture<SutType>;
  let detectChanges: () => void;

  await renderFixture(componentProperties);

  const rerender = async (rerenderedProperties: Partial<SutType>) => {
    await renderFixture(rerenderedProperties);
  };

  const change = (changedProperties: Partial<SutType>) => {
    const changes = getChangesObj(fixture.componentInstance, changedProperties);

    setComponentProperties(fixture, { componentProperties: changedProperties });

    if (hasOnChangesHook(fixture.componentInstance)) {
      fixture.componentInstance.ngOnChanges(changes);
    }

    fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
  };

  let router = routes ? inject(Router) : null;
  const zone = inject(NgZone);
  const navigate = async (elementOrPath: Element | string, basePath = ''): Promise<boolean> => {
    if (!router) {
      router = inject(Router);
    }

    const href = typeof elementOrPath === 'string' ? elementOrPath : elementOrPath.getAttribute('href');
    const [path, params] = (basePath + href).split('?');
    const queryParams = params
      ? params.split('&').reduce((qp, q) => {
          const [key, value] = q.split('=');
          const currentValue = qp[key];
          if (typeof currentValue === 'undefined') {
            qp[key] = value;
          } else if (Array.isArray(currentValue)) {
            qp[key] = [...currentValue, value];
          } else {
            qp[key] = [currentValue, value];
          }
          return qp;
        }, {} as Record<string, string | string[]>)
      : undefined;

    const navigateOptions: NavigationExtras | undefined = queryParams
      ? {
          queryParams,
        }
      : undefined;

    const doNavigate = () => {
      return navigateOptions ? router?.navigate([path], navigateOptions) : router?.navigate([path]);
    };

    let result;

    if (zone) {
      await zone.run(() => (result = doNavigate()));
    } else {
      result = doNavigate();
    }

    detectChanges();
    return result ?? false;
  };

  return {
    // @ts-ignore: fixture assigned
    fixture,
    detectChanges: () => detectChanges(),
    navigate,
    rerender,
    change,
    // @ts-ignore: fixture assigned
    debugElement: typeof sut === 'string' ? fixture.debugElement : fixture.debugElement.query(By.directive(sut)),
    // @ts-ignore: fixture assigned
    container: fixture.nativeElement,
    debug: (element = fixture.nativeElement, maxLength, options) =>
      Array.isArray(element)
        ? element.forEach((e) => console.log(dtlPrettyDOM(e, maxLength, options)))
        : console.log(dtlPrettyDOM(element, maxLength, options)),
    // @ts-ignore: fixture assigned
    ...replaceFindWithFindAndDetectChanges(dtlGetQueriesForElement(fixture.nativeElement, queries)),
  };

  async function renderFixture(properties: Partial<SutType>) {
    if (fixture) {
      cleanupAtFixture(fixture);
    }

    fixture = await createComponent(componentContainer);
    setComponentProperties(fixture, { componentProperties: properties });

    if (removeAngularAttributes) {
      fixture.nativeElement.removeAttribute('ng-version');
      const idAttribute = fixture.nativeElement.getAttribute('id');
      if (idAttribute && idAttribute.startsWith('root')) {
        fixture.nativeElement.removeAttribute('id');
      }
    }
    mountedFixtures.add(fixture);

    let isAlive = true;
    fixture.componentRef.onDestroy(() => (isAlive = false));

    if (hasOnChangesHook(fixture.componentInstance)) {
      const changes = getChangesObj(null, componentProperties);
      fixture.componentInstance.ngOnChanges(changes);
    }

    detectChanges = () => {
      if (isAlive) {
        fixture.detectChanges();
      }
    };

    if (detectChangesOnRender) {
      detectChanges();
    }
  }
}

async function createComponent<SutType>(component: Type<SutType>): Promise<ComponentFixture<SutType>> {
  /* Make sure angular application is initialized before creating component */
  await inject(ApplicationInitStatus).donePromise;
  return TestBed.createComponent(component);
}

function createComponentFixture<SutType, WrapperType>(
  sut: Type<SutType> | string,
  wrapper: Type<WrapperType>,
): Type<any> {
  if (typeof sut === 'string') {
    TestBed.overrideTemplate(wrapper, sut);
    return wrapper;
  }
  return sut;
}

function setComponentProperties<SutType>(
  fixture: ComponentFixture<SutType>,
  { componentProperties = {} }: Pick<RenderTemplateOptions<SutType, any>, 'componentProperties'>,
) {
  for (const key of Object.keys(componentProperties)) {
    const descriptor = Object.getOwnPropertyDescriptor((fixture.componentInstance as any).constructor.prototype, key);
    let _value = componentProperties[key];
    const defaultGetter = () => _value;
    const extendedSetter = (value: any) => {
      _value = value;
      descriptor?.set?.call(fixture.componentInstance, _value);
      fixture.detectChanges();
    };

    Object.defineProperty(fixture.componentInstance, key, {
      get: descriptor?.get || defaultGetter,
      set: extendedSetter,
      // Allow the property to be defined again later.
      // This happens when the component properties are updated after initial render.
      // For Jest this is `true` by default, for Karma and a real browser the default is `false`
      configurable: true,
    });

    descriptor?.set?.call(fixture.componentInstance, _value);
  }
  return fixture;
}

function hasOnChangesHook<SutType>(componentInstance: SutType): componentInstance is SutType & OnChanges {
  return (
    'ngOnChanges' in componentInstance && typeof (componentInstance as SutType & OnChanges).ngOnChanges === 'function'
  );
}

function getChangesObj<SutType extends Record<string, any>>(
  oldProps: Partial<SutType> | null,
  newProps: Partial<SutType>,
) {
  const isFirstChange = oldProps === null;
  return Object.keys(newProps).reduce<SimpleChanges>(
    (changes, key) => ({
      ...changes,
      [key]: new SimpleChange(isFirstChange ? null : oldProps[key], newProps[key], isFirstChange),
    }),
    {} as SutType,
  );
}

function addAutoDeclarations<SutType>(
  sut: Type<SutType> | string,
  {
    declarations = [],
    excludeComponentDeclaration,
    wrapper,
  }: Pick<RenderTemplateOptions<any>, 'declarations' | 'excludeComponentDeclaration' | 'wrapper'>,
) {
  if (typeof sut === 'string') {
    return [...declarations, wrapper];
  }

  const components = () => (excludeComponentDeclaration ? [] : [sut]);
  return [...declarations, ...components()];
}

function addAutoImports({ imports = [], routes }: Pick<RenderComponentOptions<any>, 'imports' | 'routes'>) {
  const animations = () => {
    const animationIsDefined =
      imports.indexOf(NoopAnimationsModule) > -1 || imports.indexOf(BrowserAnimationsModule) > -1;
    return animationIsDefined ? [] : [NoopAnimationsModule];
  };

  const routing = () => (routes ? [RouterTestingModule.withRoutes(routes)] : []);

  return [...imports, ...animations(), ...routing()];
}

/**
 * Wrap waitFor to invoke the Angular change detection cycle before invoking the callback
 */
async function waitForWrapper<T>(
  detectChanges: () => void,
  callback: () => T extends Promise<any> ? never : T,
  options?: dtlWaitForOptions,
): Promise<T> {
  let inFakeAsync = true;
  try {
    tick(0);
  } catch (err) {
    inFakeAsync = false;
  }

  detectChanges();

  return await dtlWaitFor(() => {
    setTimeout(() => detectChanges(), 0);
    if (inFakeAsync) {
      tick(0);
    }
    return callback();
  }, options);
}

/**
 * Wrap waitForElementToBeRemovedWrapper to poke the Angular change detection cycle before invoking the callback
 */
async function waitForElementToBeRemovedWrapper<T>(
  detectChanges: () => void,
  callback: (() => T) | T,
  options?: dtlWaitForOptions,
): Promise<void> {
  let cb: () => T;
  if (typeof callback !== 'function') {
    const elements = (Array.isArray(callback) ? callback : [callback]) as Element[];
    const getRemainingElements = elements.map((element) => {
      let parent = element.parentElement as Element;
      while (parent.parentElement) {
        parent = parent.parentElement;
      }
      return () => (parent.contains(element) ? element : null);
    });
    cb = () => getRemainingElements.map((c) => c()).find(Boolean) as unknown as T;
  } else {
    cb = callback as () => T;
  }

  return await dtlWaitForElementToBeRemoved(() => {
    const result = cb();
    detectChanges();
    return result;
  }, options);
}

function cleanup() {
  mountedFixtures.forEach(cleanupAtFixture);
}

function cleanupAtFixture(fixture: ComponentFixture<any>) {
  fixture.destroy();

  if (!fixture.nativeElement.getAttribute('ng-version') && fixture.nativeElement.parentNode === document.body) {
    document.body.removeChild(fixture.nativeElement);
  }
  mountedFixtures.delete(fixture);
}

// if we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this, set the ATL_SKIP_AUTO_CLEANUP env variable to 'true'
if (typeof process === 'undefined' || !process.env?.ATL_SKIP_AUTO_CLEANUP) {
  if (typeof afterEach === 'function') {
    afterEach(() => {
      cleanup();
    });
  }
}

@Component({ selector: 'atl-wrapper-component', template: '' })
class WrapperComponent {}

/**
 * Wrap findBy queries to poke the Angular change detection cycle
 */
function replaceFindWithFindAndDetectChanges<T extends Record<string, any>>(originalQueriesForContainer: T): T {
  return Object.keys(originalQueriesForContainer).reduce((newQueries, key) => {
    const getByQuery = originalQueriesForContainer[key.replace('find', 'get')];
    if (key.startsWith('find') && getByQuery) {
      newQueries[key] = async (...queryOptions: any[]) => {
        const waitOptions = queryOptions.length === 3 ? queryOptions.pop() : undefined;
        // original implementation at https://github.com/testing-library/dom-testing-library/blob/main/src/query-helpers.js
        return await waitForWrapper(detectChangesForMountedFixtures, () => getByQuery(...queryOptions), waitOptions);
      };
    } else {
      newQueries[key] = originalQueriesForContainer[key];
    }

    return newQueries;
  }, {} as Record<string, any>) as T;
}

/**
 * Call detectChanges for all fixtures
 */
function detectChangesForMountedFixtures() {
  mountedFixtures.forEach((fixture) => {
    try {
      fixture.detectChanges();
    } catch (err: any) {
      if (!err.message.startsWith('ViewDestroyedError')) {
        throw err;
      }
    }
  });
}

/**
 * Re-export screen with patched queries
 */
const screen = replaceFindWithFindAndDetectChanges(dtlScreen);

/**
 * Re-export within with patched queries
 */

const within: typeof getQueriesForElement = <T extends Queries = typeof dtlQueries>(
  element: HTMLElement,
  queriesToBind?: T,
) => {
  const container = dtlWithin(element, queriesToBind);
  return replaceFindWithFindAndDetectChanges(container);
};

/**
 * Re-export waitFor with patched waitFor
 */
async function waitFor<T>(callback: () => T extends Promise<any> ? never : T, options?: dtlWaitForOptions): Promise<T> {
  return waitForWrapper(detectChangesForMountedFixtures, callback, options);
}

/**
 * Re-export waitForElementToBeRemoved with patched waitForElementToBeRemoved
 */
async function waitForElementToBeRemoved<T>(callback: (() => T) | T, options?: dtlWaitForOptions): Promise<void> {
  return waitForElementToBeRemovedWrapper(detectChangesForMountedFixtures, callback, options);
}

/**
 * Manually export otherwise we get the following error while running Jest tests
 * TypeError: Cannot set property fireEvent of [object Object] which has only a getter
 * exports.fireEvent = fireEvent
 */
export {
  fireEvent,
  buildQueries,
  getByLabelText,
  getAllByLabelText,
  queryByLabelText,
  queryAllByLabelText,
  findByLabelText,
  findAllByLabelText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  queryByPlaceholderText,
  queryAllByPlaceholderText,
  findByPlaceholderText,
  findAllByPlaceholderText,
  getByText,
  getAllByText,
  queryByText,
  queryAllByText,
  findByText,
  findAllByText,
  getByAltText,
  getAllByAltText,
  queryByAltText,
  queryAllByAltText,
  findByAltText,
  findAllByAltText,
  getByTitle,
  getAllByTitle,
  queryByTitle,
  queryAllByTitle,
  findByTitle,
  findAllByTitle,
  getByDisplayValue,
  getAllByDisplayValue,
  queryByDisplayValue,
  queryAllByDisplayValue,
  findByDisplayValue,
  findAllByDisplayValue,
  getByRole,
  getAllByRole,
  queryByRole,
  queryAllByRole,
  findByRole,
  findAllByRole,
  getByTestId,
  getAllByTestId,
  queryByTestId,
  queryAllByTestId,
  findByTestId,
  findAllByTestId,
  createEvent,
  getDefaultNormalizer,
  getElementError,
  getNodeText,
  getQueriesForElement,
  getRoles,
  isInaccessible,
  logDOM,
  logRoles,
  prettyDOM,
  queries,
  queryAllByAttribute,
  queryByAttribute,
  queryHelpers,
} from '@testing-library/dom';

// export patched dtl
export { screen, waitFor, waitForElementToBeRemoved, within };
