import { Type, DebugElement, EventEmitter, Signal, InputSignalWithTransform } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { BoundFunction, Queries, queries, Config as dtlConfig, PrettyDOMOptions } from '@testing-library/dom';

// TODO: import from Angular (is a breaking change)
interface OutputRef<T> {
  subscribe(callback: (value: T) => void): OutputRefSubscription;
}
interface OutputRefSubscription {
  unsubscribe(): void;
}

export type OutputRefKeysWithCallback<T> = {
  [key in keyof T]?: T[key] extends EventEmitter<infer U>
    ? (val: U) => void
    : T[key] extends OutputRef<infer U>
    ? (val: U) => void
    : never;
};

export type RenderResultQueries<Q extends Queries = typeof queries> = { [P in keyof Q]: BoundFunction<Q[P]> };
export interface RenderResult<ComponentType, WrapperType = ComponentType> extends RenderResultQueries {
  /**
   * @description
   * The containing DOM node of your rendered Angular Component.
   * This is a regular DOM node, so you can call container.querySelector etc. to inspect the children.
   */
  container: Element;
  /**
   * @description
   * Prints out the component's DOM with syntax highlighting.
   * Accepts an optional parameter, to print out a specific DOM node.
   *
   * @param
   * element: The to be printed HTML element, if not provided it will log the whole component's DOM
   */
  debug: (
    element?: Element | Document | (Element | Document)[],
    maxLength?: number,
    options?: PrettyDOMOptions,
  ) => void;
  /**
   * @description
   * Trigger a change detection cycle for the component.
   *
   * For more info see https://angular.io/api/core/testing/ComponentFixture#detectChanges
   */
  detectChanges: () => void;
  /**
   * @description
   * The Angular `DebugElement` of the component.
   *
   * For more info see https://angular.io/api/core/DebugElement
   */
  debugElement: DebugElement;
  /**
   * @description
   * The Angular `ComponentFixture` of the component or the wrapper.
   * If a template is provided, it will be the fixture of the wrapper.
   *
   * For more info see https://angular.io/api/core/testing/ComponentFixture
   */
  fixture: ComponentFixture<WrapperType>;
  /**
   * @description
   * Navigates to the href of the element or to the path.
   *
   */
  navigate: (elementOrPath: Element | string, basePath?: string) => Promise<boolean>;
  /**
   * @description
   * Re-render the same component with different properties.
   * Properties not passed in again are removed.
   */
  rerender: (
    properties?: Pick<
      RenderTemplateOptions<ComponentType>,
      'componentProperties' | 'componentInputs' | 'inputs' | 'componentOutputs' | 'on' | 'detectChangesOnRender'
    > & { partialUpdate?: boolean },
  ) => Promise<void>;
  /**
   * @description
   * Set the state of a deferrable block.
   */
  renderDeferBlock: (deferBlockState: DeferBlockState, deferBlockIndex?: number) => Promise<void>;
}

declare const ALIASED_INPUT_BRAND: unique symbol;
export type AliasedInput<T> = T & {
  [ALIASED_INPUT_BRAND]: T;
};
export type AliasedInputs = Record<string, AliasedInput<unknown>>;

export type ComponentInput<T> =
  | {
      [P in keyof T]?: T[P] extends InputSignalWithTransform<any, infer U>
        ? U
        : T[P] extends Signal<infer U>
        ? U
        : T[P];
    }
  | AliasedInputs;

/**
 * @description
 * Creates an aliased input branded type with a value
 *
 */
export function aliasedInput<TAlias extends string, T>(alias: TAlias, value: T): Record<TAlias, AliasedInput<T>> {
  return { [alias]: value } as Record<TAlias, AliasedInput<T>>;
}

export interface RenderComponentOptions<ComponentType, Q extends Queries = typeof queries> {
  /**
   * @description
   * Automatically detect changes as a "real" running component would do.
   *
   * @default
   * true
   *
   * @example
   * await render(AppComponent, {
   *  autoDetectChanges: false
   * })
   */
  autoDetectChanges?: boolean;
  /**
   * @description
   * Invokes `detectChanges` after the component is rendered
   *
   * @default
   * true
   *
   * @example
   * await render(AppComponent, {
   *  detectChangesOnRender: false
   * })
   */
  detectChangesOnRender?: boolean;

  /**
   * @description
   * A collection of components, directives and pipes needed to render the component, for example, nested components of the component.
   *
   * For more info see https://angular.io/api/core/NgModule#declarations
   *
   * @default
   * []
   *
   * @example
   * await render(AppComponent, {
   *  declarations: [ CustomerDetailComponent, ButtonComponent ]
   * })
   */
  declarations?: any[];
  /**
   * @description
   * A collection of providers needed to render the component via Dependency Injection, for example, injectable services or tokens.
   *
   * For more info see https://angular.io/api/core/NgModule#providers
   *
   * @default
   * []
   *
   * @example
   * await render(AppComponent, {
   *  providers: [
   *    CustomersService,
   *    {
   *      provide: MAX_CUSTOMERS_TOKEN,
   *      useValue: 10
   *    }
   *  ]
   * })
   */
  providers?: any[];
  /**
   * @description
   * A collection of imports needed to render the component, for example, shared modules.
   * Adds `NoopAnimationsModule` by default if `BrowserAnimationsModule` isn't added to the collection.
   *
   * For more info see https://angular.io/api/core/NgModule#imports
   *
   * @default
   * `[NoopAnimationsModule]`
   *
   * @example
   * await render(AppComponent, {
   *  imports: [
   *    AppSharedModule,
   *    MaterialModule,
   *  ]
   * })
   */
  imports?: any[];
  /**
   * @description
   * A collection of schemas needed to render the component.
   * Allowed values are `NO_ERRORS_SCHEMA` and `CUSTOM_ELEMENTS_SCHEMA`.
   *
   * For more info see https://angular.io/api/core/NgModule#schemas
   *
   * @default
   * []
   *
   * @example
   * await render(AppComponent, {
   *  schemas: [
   *    NO_ERRORS_SCHEMA,
   *  ]
   * })
   */
  schemas?: any[];
  /**
   * @description
   * An object to set properties of the component
   * @deprecated use the `on` or `inputs` option instead.
   * @default
   * {}
   *
   * @example
   * await render(AppComponent, {
   *  componentProperties: {
   *    counterValue: 10,
   *    send: (value) => { ... }
   *  }
   * })
   */
  componentProperties?: Partial<ComponentType>;
  /**
   * @description
   * An object to set `@Input` properties of the component
   *
   * @deprecated use the `inputs` option instead. When you need to use aliases, use the `aliasedInput(...)` helper function.
   * @default
   * {}
   *
   * @example
   * await render(AppComponent, {
   *  componentInputs: {
   *    counterValue: 10
   *  }
   * })
   */
  componentInputs?: Partial<ComponentType> | { [alias: string]: unknown };

  /**
   * @description
   * An object to set `@Input` or `input()` properties of the component
   *
   * @default
   * {}
   *
   * @example
   * await render(AppComponent, {
   * inputs: {
   *  counterValue: 10,
   *  // explicitly define aliases this way:
   *  ...aliasedInput('someAlias', 'someValue')
   * })
   */
  inputs?: ComponentInput<ComponentType>;

  /**
   * @description
   * An object to set `@Output` properties of the component
   * @deprecated use the `on` option instead. When it is necessary to override properties, use the `componentProperties` option.
   * @default
   * {}
   *
   * @example
   * const sendValue = new EventEmitter<any>();
   * await render(AppComponent, {
   *  componentOutputs: {
   *    send: {
   *      emit: sendValue
   *    }
   *  }
   * })
   */
  componentOutputs?: Partial<ComponentType>;

  /**
   * @description
   * An object with callbacks to subscribe to EventEmitters/Observables of the component
   *
   * @default
   * {}
   *
   * @example
   * const sendValue = (value) => { ... }
   * await render(AppComponent, {
   *  on: {
   *    send: (_v:any) => void
   *  }
   * })
   */
  on?: OutputRefKeysWithCallback<ComponentType>;

  /**
   * @description
   * A collection of providers to inject dependencies of the component.
   *
   * For more info see https://angular.io/api/core/Directive#providers
   *
   * @default
   * []
   *
   * @example
   * await render(AppComponent, {
   *  componentProviders: [
   *    AppComponentService
   *  ]
   * })
   */
  componentProviders?: any[];
  /**
   * @description
   * Collection of child component specified providers to override with
   *
   * @default
   * []
   *
   * @example
   * await render(AppComponent, {
   *  childComponentOverrides: [
   *    {
   *      component: ChildOfAppComponent,
   *      providers: [{ provide: MyService, useValue: { hello: 'world' } }]
   *    }
   *  ]
   * })
   *
   */
  childComponentOverrides?: ComponentOverride<any>[];
  /**
   * @description
   * A collection of imports to override a standalone component's imports with.
   *
   * @default
   * undefined
   *
   * @example
   * await render(AppComponent, {
   *   componentImports: [
   *     MockChildComponent
   *   ]
   * })
   */
  componentImports?: (Type<any> | any[])[];
  /**
   * @description
   * Queries to bind. Overrides the default set from DOM Testing Library unless merged.
   *
   * @default
   * undefined
   *
   * @example
   * import * as customQueries from 'custom-queries'
   * import { queries } from '@testing-library/angular'
   *
   * await render(AppComponent, {
   *  queries: { ...queries, ...customQueries }
   * })
   */
  queries?: Q;
  /**
   * @description
   * Exclude the component to be automatically be added as a declaration.
   * This is needed when the component is declared in an imported module.
   *
   * @default
   * false
   *
   * @example
   * await render(AppComponent, {
   *  imports: [AppModule], // a module that includes AppComponent
   *  excludeComponentDeclaration: true
   * })
   */
  excludeComponentDeclaration?: boolean;

  /**
   * @description
   * The route configuration to set up the router service via `RouterTestingModule.withRoutes`.
   * For more info see https://angular.io/api/router/Routes.
   *
   * @example
   * await render(AppComponent, {
   *  declarations: [ChildComponent],
   *  routes: [
   *    {
   *      path: '',
   *      children: [
   *         {
   *            path: 'child/:id',
   *            component: ChildComponent
   *          }
   *      ]
   *    }
   *  ]
   * })
   */
  routes?: Routes;

  /**
   * @description
   * Specifies which route should be initially navigated to
   *
   * @example
   * await render(AppComponent, {
   *  initialRoute: 'myroute',
   *  routes: [
   *    { path: '', component: HomeComponent },
   *    { path: 'myroute', component: SecondaryComponent }
   *  ]
   * })
   */
  initialRoute?: string;

  /**
   * @description
   * Removes the Angular attributes (ng-version, and root-id) from the fixture.
   *
   * @default
   * `false`
   *
   * @example
   * await render(AppComponent, {
   *  removeAngularAttributes: true
   * })
   */
  removeAngularAttributes?: boolean;

  /**
   * @description
   * Callback to configure the testbed before the compilation.
   *
   * @default
   * () => {}
   *
   * @example
   * await render(AppComponent, {
   *  configureTestBed: (testBed) => { }
   * })
   */
  configureTestBed?: (testbed: TestBed) => void;

  /**
   * @description
   * Set the initial state of a deferrable block.
   */
  deferBlockStates?: DeferBlockState | { deferBlockState: DeferBlockState; deferBlockIndex: number }[];

  /**
   * @description
   * Set the defer blocks behavior.
   */
  deferBlockBehavior?: DeferBlockBehavior;
}

export interface ComponentOverride<T> {
  component: Type<T>;
  providers: any[];
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface RenderTemplateOptions<WrapperType, Properties extends object = {}, Q extends Queries = typeof queries>
  extends RenderComponentOptions<Properties, Q> {
  /**
   * @description
   * An Angular component to wrap the component in.
   * The template will be overridden with the `template` option.
   *
   * @default
   * `WrapperComponent`, an empty component that strips the `ng-version` attribute
   *
   * @example
   * await render(`<div spoiler message='SPOILER'></div>`, {
   *  declarations: [SpoilerDirective]
   *  wrapper: CustomWrapperComponent
   * })
   */
  wrapper?: Type<WrapperType>;
  componentProperties?: Partial<WrapperType & Properties>;
}

export interface Config extends Pick<RenderComponentOptions<any>, 'excludeComponentDeclaration'> {
  /**
   * DOM Testing Library config
   * @link https://testing-library.com/docs/dom-testing-library/api-configuration/
   */
  dom: Partial<dtlConfig>;
  /**
   * Imports that are added to the imports
   */
  defaultImports: any[];
}
