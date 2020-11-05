import { ChangeDetectorRef, Component, Type, NgZone, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  waitForOptions as dtlWaitForOptions,
  configure as dtlConfigure,
} from '@testing-library/dom';
import { RenderComponentOptions, RenderDirectiveOptions, RenderResult } from './models';
import { getConfig } from './config';

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

  const config = getConfig();

  dtlConfigure({
    eventWrapper: (cb) => {
      const result = cb();
      detectChangesForMountedFixtures();
      return result;
    },
    ...config.dom,
  });

  TestBed.configureTestingModule({
    declarations: addAutoDeclarations(sut, { declarations, excludeComponentDeclaration, template, wrapper }),
    imports: addAutoImports({ imports: imports.concat(config.defaultImports), routes }),
    providers: [...providers],
    schemas: [...schemas],
  });

  if (componentProviders) {
    componentProviders
      .reduce((acc, provider) => acc.concat(provider), [])
      .forEach((p) => {
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

  // Call ngOnChanges on initial render
  if (hasOnChangesHook(fixture.componentInstance)) {
    const changes = getChangesObj(null, fixture.componentInstance);
    fixture.componentInstance.ngOnChanges(changes);
  }

  if (detectChangesOnRender) {
    detectChanges();
  }

  const rerender = (rerenderedProperties: Partial<SutType>) => {
    const changes = getChangesObj(fixture.componentInstance, rerenderedProperties);

    setComponentProperties(fixture, { componentProperties: rerenderedProperties });

    if (hasOnChangesHook(fixture.componentInstance)) {
      fixture.componentInstance.ngOnChanges(changes);
    }

    fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
  };

  const inject = TestBed.inject || TestBed.get;
  let router = routes ? inject(Router) : null;
  const zone = inject(NgZone);
  const navigate = async (elementOrPath: Element | string, basePath = '') => {
    if (!router) {
      router = inject(Router);
    }

    const href = typeof elementOrPath === 'string' ? elementOrPath : elementOrPath.getAttribute('href');
    const [path, params] = (basePath + href).split('?');
    const queryParams = params
      ? params.split('&').reduce((qp, q) => {
          const [key, value] = q.split('=');
          // TODO(Breaking): group same keys qp[key] ? [...qp[key], value] : value
          qp[key] = value;
          return qp;
        }, {})
      : undefined;

    const navigateOptions: NavigationExtras = queryParams
      ? {
          queryParams,
        }
      : undefined;

    const doNavigate = () => (navigateOptions ? router.navigate([path], navigateOptions) : router.navigate([path]));

    let result;

    if (zone) {
      await zone.run(() => (result = doNavigate()));
    } else {
      result = doNavigate();
    }

    detectChanges();
    return result;
  };

  return {
    fixture,
    detectChanges,
    navigate,
    rerender,
    debugElement: fixture.debugElement.query(By.directive(sut)),
    container: fixture.nativeElement,
    debug: (element = fixture.nativeElement, maxLength, options) =>
      Array.isArray(element)
        ? element.forEach((e) => console.log(dtlPrettyDOM(e, maxLength, options)))
        : console.log(dtlPrettyDOM(element, maxLength, options)),
    ...replaceFindWithFindAndDetectChanges(dtlGetQueriesForElement(fixture.nativeElement, queries)),
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

function hasOnChangesHook<SutType>(componentInstance: SutType): componentInstance is SutType & OnChanges {
  return (
    'ngOnChanges' in componentInstance && typeof (componentInstance as SutType & OnChanges).ngOnChanges === 'function'
  );
}

function getChangesObj<SutType>(oldProps: Partial<SutType> | null, newProps: Partial<SutType>) {
  const isFirstChange = oldProps === null;
  return Object.keys(newProps).reduce<SimpleChanges>(
    (changes, key) => ({
      ...changes,
      [key]: new SimpleChange(isFirstChange ? null : oldProps[key], newProps[key], isFirstChange),
    }),
    {},
  );
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

/**
 * Wrap waitFor to poke the Angular change detection cycle before invoking the callback
 */
async function waitForWrapper<T>(
  detectChanges: () => void,
  callback: () => T extends Promise<any> ? never : T,
  options?: dtlWaitForOptions,
): Promise<T> {
  return await dtlWaitFor(() => {
    detectChanges();
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
  let cb;
  if (typeof callback !== 'function') {
    const elements = (Array.isArray(callback) ? callback : [callback]) as HTMLElement[];
    const getRemainingElements = elements.map((element) => {
      let parent = element.parentElement;
      while (parent.parentElement) {
        parent = parent.parentElement;
      }
      return () => (parent.contains(element) ? element : null);
    });
    cb = () => getRemainingElements.map((c) => c()).filter(Boolean);
  } else {
    cb = callback;
  }

  return await dtlWaitForElementToBeRemoved(() => {
    detectChanges();
    return cb();
  }, options);
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

@Component({ selector: 'wrapper-component', template: '' })
class WrapperComponent {}

/**
 * Wrap findBy queries to poke the Angular change detection cycle
 */
function replaceFindWithFindAndDetectChanges<T>(originalQueriesForContainer: T): T {
  return Object.keys(originalQueriesForContainer).reduce((newQueries, key) => {
    const getByQuery = originalQueriesForContainer[key.replace('find', 'get')];
    if (key.startsWith('find') && getByQuery) {
      newQueries[key] = async (text, options, waitOptions) => {
        // original implementation at https://github.com/testing-library/dom-testing-library/blob/master/src/query-helpers.js
        const result = await waitForWrapper(
          detectChangesForMountedFixtures,
          () => getByQuery(text, options),
          waitOptions,
        );
        return result;
      };
    } else {
      newQueries[key] = originalQueriesForContainer[key];
    }

    return newQueries;
  }, {} as T);
}

/**
 * Call detectChanges for all fixtures
 */
function detectChangesForMountedFixtures() {
  mountedFixtures.forEach((fixture) => {
    try {
      fixture.detectChanges();
    } catch (err) {
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
  within,
} from '@testing-library/dom';

// export patched dtl
export { screen, waitFor, waitForElementToBeRemoved };
