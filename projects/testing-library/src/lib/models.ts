import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { FireObject, Queries, queries, BoundFunction } from '@testing-library/dom';
import { UserEvents } from './user-events';

export type RenderResultQueries<Q extends Queries = typeof queries> = { [P in keyof Q]: BoundFunction<Q[P]> };

export interface RenderResult extends RenderResultQueries, FireObject, UserEvents {
  /**
   * @description
   * The containing DOM node of your rendered Angular Component.
   * This is a regular DOM node, so you can call container.querySelector etc. to inspect the children.
   */
  container: HTMLElement;
  /**
   * @description
   * Prints out the component's DOM with syntax highlighting.
   * Accepts an optional parameter, to print out a specific DOM node.
   *
   * @param
   * element: The to be printed HTML element, if not provided it will log the whole component's DOM
   */
  debug: (element?: HTMLElement) => void;
  /**
   * @description
   * The Angular `ComponentFixture` of the component.
   *
   * For more info see https://angular.io/api/core/testing/ComponentFixture
   */
  fixture: ComponentFixture<any>;
}

export interface RenderOptions<C, Q extends Queries = typeof queries> {
  /**
   * @description
   * Will call detectChanges when the component is compiled
   *
   * @default
   * true
   *
   * @example
   * const component = render(AppComponent, {
   *  detectChanges: false
   * })
   */
  detectChanges?: boolean;
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
   * const component = render(AppComponent, {
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
   * const component = render(AppComponent, {
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
   * const component = render(AppComponent, {
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
   * const component = render(AppComponent, {
   *  schemas: [
   *    NO_ERRORS_SCHEMA,
   *  ]
   * })
   */
  schemas?: any[];
  /**
   * @description
   * An object to set `@Input` and `@Output` properties of the component
   *
   * @default
   * {}
   *
   * @example
   * const component = render(AppComponent, {
   *  componentProperties: {
   *    counterValue: 10,
   *    send: (value) => { ... }
   *  }
   * })
   */
  componentProperties?: Partial<C>;
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
   * const component = render(AppComponent, {
   *  componentProviders: [
   *    AppComponentService
   *  ]
   * })
   */
  componentProviders?: any[];
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
   * const component = render(AppComponent, {
   *  queries: { ...queries, ...customQueries }
   * })
   */
  queries?: Q;
  /**
   * @description
   * An Angular component to wrap the component in.
   *
   * @default
   * `WrapperComponent`, an empty component that strips the `ng-version` attribute
   *
   * @example
   * const component = render(AppComponent, {
   *  wrapper: CustomWrapperComponent
   * })
   */
  wrapper?: Type<any>;
  /**
   * @description
   * Exclude the component to be automatically be added as a declaration.
   * This is needed when the component is declared in an imported module.
   *
   * @default
   * false
   *
   * @example
   * const component = render(AppComponent, {
   *  imports: [AppModule], // a module that includes AppComponent
   *  excludeComponentDeclaration: true
   * })
   */
  excludeComponentDeclaration?: boolean;
}
