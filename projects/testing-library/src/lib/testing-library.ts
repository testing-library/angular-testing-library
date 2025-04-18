import {
  ApplicationInitStatus,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnChanges,
  OutputRef,
  OutputRefSubscription,
  SimpleChange,
  SimpleChanges,
  Type,
  isStandalone,
} from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationExtras, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import type { BoundFunctions, Queries } from '@testing-library/dom';
import {
  configure as dtlConfigure,
  getQueriesForElement as dtlGetQueriesForElement,
  prettyDOM as dtlPrettyDOM,
  queries as dtlQueries,
  screen as dtlScreen,
  waitFor as dtlWaitFor,
  waitForElementToBeRemoved as dtlWaitForElementToBeRemoved,
  waitForOptions as dtlWaitForOptions,
  within as dtlWithin,
} from '@testing-library/dom';
import { getConfig } from './config';
import {
  ComponentOverride,
  OutputRefKeysWithCallback,
  RenderComponentOptions,
  RenderResult,
  RenderTemplateOptions,
  Config,
} from './models';

type SubscribedOutput<T> = readonly [key: keyof T, callback: (v: any) => void, subscription: OutputRefSubscription];

const mountedFixtures = new Set<ComponentFixture<any>>();
const safeInject = TestBed.inject || TestBed.get;

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
    detectChangesOnRender = true,
    autoDetectChanges = true,
    declarations = [],
    imports = [],
    providers = [],
    schemas = [],
    queries,
    wrapper = WrapperComponent as Type<WrapperType>,
    componentProperties = {},
    componentInputs = {},
    componentOutputs = {},
    inputs: newInputs = {},
    on = {},
    componentProviders = [],
    childComponentOverrides = [],
    componentImports,
    excludeComponentDeclaration = false,
    routes = [],
    removeAngularAttributes = false,
    defaultImports = [],
    initialRoute = '',
    deferBlockStates = undefined,
    deferBlockBehavior = undefined,
    configureTestBed = () => {
      /* noop*/
    },
  } = { ...globalConfig, ...renderOptions } as RenderComponentOptions<SutType> &
    RenderTemplateOptions<WrapperType> &
    Config;

  dtlConfigure({
    eventWrapper: (cb) => {
      const result = cb();
      if (autoDetectChanges) {
        detectChangesForMountedFixtures();
      }
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
    imports: addAutoImports(sut, {
      imports: imports.concat(defaultImports),
      routes,
    }),
    providers: [...providers],
    schemas: [...schemas],
    deferBlockBehavior: deferBlockBehavior ?? DeferBlockBehavior.Manual,
  });
  overrideComponentImports(sut, componentImports);
  overrideChildComponentProviders(childComponentOverrides);

  configureTestBed(TestBed);

  await TestBed.compileComponents();

  // Angular supports nested arrays of providers, so we need to flatten them to emulate the same behavior.
  for (const { provide, ...provider } of componentProviders.flat(Infinity)) {
    TestBed.overrideProvider(provide, provider);
  }

  const componentContainer = createComponentFixture(sut, wrapper);

  const zone = safeInject(NgZone);
  const router = safeInject(Router);
  const _navigate = async (elementOrPath: Element | string, basePath = ''): Promise<boolean> => {
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
      await zone.run(() => {
        result = doNavigate();
      });
    } else {
      result = doNavigate();
    }
    return result ?? false;
  };

  if (initialRoute) await _navigate(initialRoute);

  if (typeof router?.initialNavigation === 'function') {
    if (zone) {
      zone.run(() => router.initialNavigation());
    } else {
      router.initialNavigation();
    }
  }

  let detectChanges: () => void;

  const allInputs = { ...componentInputs, ...newInputs };

  let renderedPropKeys = Object.keys(componentProperties);
  let renderedInputKeys = Object.keys(allInputs);
  let renderedOutputKeys = Object.keys(componentOutputs);
  let subscribedOutputs: SubscribedOutput<SutType>[] = [];

  const renderFixture = async (
    properties: Partial<SutType>,
    inputs: Partial<SutType>,
    outputs: Partial<SutType>,
    subscribeTo: OutputRefKeysWithCallback<SutType>,
  ): Promise<ComponentFixture<SutType>> => {
    const createdFixture: ComponentFixture<SutType> = await createComponent(componentContainer);
    setComponentProperties(createdFixture, properties);
    setComponentInputs(createdFixture, inputs);
    setComponentOutputs(createdFixture, outputs);
    subscribedOutputs = subscribeToComponentOutputs(createdFixture, subscribeTo);

    if (removeAngularAttributes) {
      createdFixture.nativeElement.removeAttribute('ng-version');
      const idAttribute = createdFixture.nativeElement.getAttribute('id');
      if (idAttribute?.startsWith('root')) {
        createdFixture.nativeElement.removeAttribute('id');
      }
    }

    mountedFixtures.add(createdFixture);

    let isAlive = true;
    createdFixture.componentRef.onDestroy(() => {
      isAlive = false;
    });

    if (hasOnChangesHook(createdFixture.componentInstance) && Object.keys(properties).length > 0) {
      const changes = getChangesObj(null, componentProperties);
      createdFixture.componentInstance.ngOnChanges(changes);
    }

    detectChanges = () => {
      if (isAlive) {
        createdFixture.detectChanges();
      }
    };

    if (detectChangesOnRender) {
      detectChanges();
    }

    return createdFixture;
  };

  const fixture = await renderFixture(componentProperties, allInputs as any, componentOutputs, on);

  if (deferBlockStates) {
    if (Array.isArray(deferBlockStates)) {
      for (const deferBlockState of deferBlockStates) {
        await renderDeferBlock(fixture, deferBlockState.deferBlockState, deferBlockState.deferBlockIndex);
      }
    } else {
      await renderDeferBlock(fixture, deferBlockStates);
    }
  }

  const rerender = async (
    properties?: Pick<
      RenderTemplateOptions<SutType>,
      'componentProperties' | 'componentInputs' | 'inputs' | 'componentOutputs' | 'on' | 'detectChangesOnRender'
    > & { partialUpdate?: boolean },
  ) => {
    const newComponentInputs = { ...properties?.componentInputs, ...properties?.inputs };
    const changesInComponentInput = update(
      fixture,
      renderedInputKeys,
      newComponentInputs,
      setComponentInputs,
      properties?.partialUpdate ?? false,
    );
    renderedInputKeys = Object.keys(newComponentInputs);

    const newComponentOutputs = properties?.componentOutputs ?? {};
    for (const outputKey of renderedOutputKeys) {
      if (!Object.prototype.hasOwnProperty.call(newComponentOutputs, outputKey)) {
        delete (fixture.componentInstance as any)[outputKey];
      }
    }
    setComponentOutputs(fixture, newComponentOutputs);
    renderedOutputKeys = Object.keys(newComponentOutputs);

    // first unsubscribe the no longer available or changed callback-fns
    const newObservableSubscriptions: OutputRefKeysWithCallback<SutType> = properties?.on ?? {};
    for (const [key, cb, subscription] of subscribedOutputs) {
      // when no longer provided or when the callback has changed
      if (!(key in newObservableSubscriptions) || cb !== (newObservableSubscriptions as any)[key]) {
        subscription.unsubscribe();
      }
    }
    // then subscribe the new callback-fns
    subscribedOutputs = Object.entries(newObservableSubscriptions).map(([key, cb]) => {
      const existing = subscribedOutputs.find(([k]) => k === key);
      return existing && existing[1] === cb
        ? existing // nothing to do
        : subscribeToComponentOutput(fixture, key as keyof SutType, cb as (v: any) => void);
    });

    const newComponentProps = properties?.componentProperties ?? {};
    const changesInComponentProps = update(
      fixture,
      renderedPropKeys,
      newComponentProps,
      setComponentProperties,
      properties?.partialUpdate ?? false,
    );
    renderedPropKeys = Object.keys(newComponentProps);

    if (hasOnChangesHook(fixture.componentInstance)) {
      fixture.componentInstance.ngOnChanges({
        ...changesInComponentInput,
        ...changesInComponentProps,
      });
    }

    if (properties?.detectChangesOnRender !== false) {
      fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
    }
  };

  const navigate = async (elementOrPath: Element | string, basePath = ''): Promise<boolean> => {
    const result = await _navigate(elementOrPath, basePath);
    detectChanges();
    return result;
  };

  return {
    fixture,
    detectChanges: () => detectChanges(),
    navigate,
    rerender,
    renderDeferBlock: async (deferBlockState: DeferBlockState, deferBlockIndex?: number) => {
      await renderDeferBlock(fixture, deferBlockState, deferBlockIndex);
    },
    debugElement: fixture.debugElement,
    container: fixture.nativeElement,
    debug: (element = fixture.nativeElement, maxLength, options) => {
      if (Array.isArray(element)) {
        for (const e of element) {
          console.log(dtlPrettyDOM(e, maxLength, options));
        }
      } else {
        console.log(dtlPrettyDOM(element, maxLength, options));
      }
    },
    ...replaceFindWithFindAndDetectChanges(dtlGetQueriesForElement(fixture.nativeElement, queries)),
  };
}

async function createComponent<SutType>(component: Type<SutType>): Promise<ComponentFixture<SutType>> {
  /* Make sure angular application is initialized before creating component */
  await safeInject(ApplicationInitStatus).donePromise;
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
  componentProperties: RenderTemplateOptions<SutType, any>['componentProperties'] = {},
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

function setComponentOutputs<SutType>(
  fixture: ComponentFixture<SutType>,
  componentOutputs: RenderTemplateOptions<SutType, any>['componentOutputs'] = {},
) {
  for (const [name, value] of Object.entries(componentOutputs)) {
    (fixture.componentInstance as any)[name] = value;
  }
}

function setComponentInputs<SutType>(
  fixture: ComponentFixture<SutType>,
  componentInputs: RenderTemplateOptions<SutType>['componentInputs'] = {},
) {
  for (const [name, value] of Object.entries(componentInputs)) {
    fixture.componentRef.setInput(name, value);
  }
}

function subscribeToComponentOutputs<SutType>(
  fixture: ComponentFixture<SutType>,
  listeners: OutputRefKeysWithCallback<SutType>,
): SubscribedOutput<SutType>[] {
  // with Object.entries we lose the type information of the key and callback, therefore we need to cast them
  return Object.entries(listeners).map(([key, cb]) =>
    subscribeToComponentOutput(fixture, key as keyof SutType, cb as (v: any) => void),
  );
}

function subscribeToComponentOutput<SutType>(
  fixture: ComponentFixture<SutType>,
  key: keyof SutType,
  cb: (val: any) => void,
): SubscribedOutput<SutType> {
  const eventEmitter = (fixture.componentInstance as any)[key] as OutputRef<any>;
  const subscription = eventEmitter.subscribe(cb);
  fixture.componentRef.onDestroy(subscription.unsubscribe.bind(subscription));
  return [key, cb, subscription];
}

function overrideComponentImports<SutType>(sut: Type<SutType> | string, imports: (Type<any> | any[])[] | undefined) {
  if (imports) {
    if (typeof sut === 'function' && isStandalone(sut)) {
      TestBed.overrideComponent(sut, { set: { imports } });
    } else {
      throw new Error(
        `Error while rendering ${sut}: Cannot specify componentImports on a template or non-standalone component.`,
      );
    }
  }
}

function overrideChildComponentProviders(componentOverrides: ComponentOverride<any>[]) {
  if (componentOverrides) {
    for (const { component, providers } of componentOverrides) {
      TestBed.overrideComponent(component, { set: { providers } });
    }
  }
}

function hasOnChangesHook<SutType>(componentInstance: SutType): componentInstance is SutType & OnChanges {
  return (
    componentInstance !== null &&
    typeof componentInstance === 'object' &&
    'ngOnChanges' in componentInstance &&
    typeof (componentInstance as SutType & OnChanges).ngOnChanges === 'function'
  );
}

function getChangesObj(oldProps: Record<string, any> | null, newProps: Record<string, any>) {
  const isFirstChange = oldProps === null;
  return Object.keys(newProps).reduce<SimpleChanges>((changes, key) => {
    changes[key] = new SimpleChange(isFirstChange ? null : oldProps[key], newProps[key], isFirstChange);
    return changes;
  }, {} as Record<string, any>);
}

function update<SutType>(
  fixture: ComponentFixture<SutType>,
  prevRenderedKeys: string[],
  newValues: Record<string, any>,
  updateFunction: (
    fixture: ComponentFixture<SutType>,
    values: RenderTemplateOptions<SutType>['componentInputs' | 'componentProperties'],
  ) => void,
  partialUpdate: boolean,
) {
  const componentInstance = fixture.componentInstance as Record<string, any>;
  const simpleChanges: SimpleChanges = {};

  if (!partialUpdate) {
    for (const key of prevRenderedKeys) {
      if (!Object.prototype.hasOwnProperty.call(newValues, key)) {
        simpleChanges[key] = new SimpleChange(componentInstance[key], undefined, false);
        delete componentInstance[key];
      }
    }
  }

  for (const [key, value] of Object.entries(newValues)) {
    if (value !== componentInstance[key]) {
      simpleChanges[key] = new SimpleChange(componentInstance[key], value, false);
    }
  }

  updateFunction(fixture, newValues);

  return simpleChanges;
}

function addAutoDeclarations<SutType>(
  sut: Type<SutType> | string,
  {
    declarations = [],
    excludeComponentDeclaration,
    wrapper,
  }: Pick<RenderTemplateOptions<any>, 'declarations' | 'excludeComponentDeclaration' | 'wrapper'>,
) {
  const nonStandaloneDeclarations = declarations?.filter((d) => !isStandalone(d));
  if (typeof sut === 'string') {
    if (wrapper && isStandalone(wrapper)) {
      return nonStandaloneDeclarations;
    }
    return [...nonStandaloneDeclarations, wrapper];
  }

  const components = () => (excludeComponentDeclaration || isStandalone(sut) ? [] : [sut]);
  return [...nonStandaloneDeclarations, ...components()];
}

function addAutoImports<SutType>(
  sut: Type<SutType> | string,
  { imports = [], routes }: Pick<RenderComponentOptions<any>, 'imports' | 'routes'>,
) {
  const animations = () => {
    const animationIsDefined =
      imports.indexOf(NoopAnimationsModule) > -1 || imports.indexOf(BrowserAnimationsModule) > -1;
    return animationIsDefined ? [] : [NoopAnimationsModule];
  };

  const routing = () => (routes ? [RouterTestingModule.withRoutes(routes)] : []);
  const components = () => (typeof sut !== 'string' && isStandalone(sut) ? [sut] : []);
  return [...imports, ...components(), ...animations(), ...routing()];
}

async function renderDeferBlock<SutType>(
  fixture: ComponentFixture<SutType>,
  deferBlockState: DeferBlockState,
  deferBlockIndex?: number,
) {
  const deferBlockFixtures = await fixture.getDeferBlocks();

  if (deferBlockIndex !== undefined) {
    if (deferBlockIndex < 0) {
      throw new Error('deferBlockIndex must be a positive number');
    }

    const deferBlockFixture = deferBlockFixtures[deferBlockIndex];
    if (!deferBlockFixture) {
      throw new Error(`Could not find a deferrable block with index '${deferBlockIndex}'`);
    }
    await deferBlockFixture.render(deferBlockState);
  } else {
    for (const deferBlockFixture of deferBlockFixtures) {
      await deferBlockFixture.render(deferBlockState);
    }
  }
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
  } catch {
    inFakeAsync = false;
  }

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
  } else if (!fixture.nativeElement.getAttribute('id') && document.body.children?.[0] === fixture.nativeElement) {
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

@Component({ selector: 'atl-wrapper-component', template: '', standalone: false })
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
  for (const fixture of mountedFixtures) {
    try {
      fixture.detectChanges();
    } catch (err: any) {
      if (!err.message.startsWith('ViewDestroyedError')) {
        throw err;
      }
    }
  }
}

/**
 * Re-export screen with patched queries
 */
const screen = replaceFindWithFindAndDetectChanges(dtlScreen);

/**
 * Re-export within with patched queries
 */
const within = <QueriesToBind extends Queries = typeof dtlQueries, T extends QueriesToBind = QueriesToBind>(
  element: HTMLElement,
  queriesToBind?: T,
): BoundFunctions<T> => {
  const container = dtlWithin<T>(element, queriesToBind);
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
