import { Component, type Type, type Binding, type Provider, type EnvironmentProviders } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  getQueriesForElement,
  prettyDOM,
  type BoundFunction,
  type PrettyDOMOptions,
  type queries,
  type Queries,
} from '@testing-library/dom';

export type RenderResultQueries<Q extends Queries = typeof queries> = { [P in keyof Q]: BoundFunction<Q[P]> };

export interface RenderResult<ComponentType, WrapperType = ComponentType> extends RenderResultQueries {
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
  debug: (
    element?: Element | Document | (Element | Document)[],
    maxLength?: number,
    options?: PrettyDOMOptions,
  ) => void;

  /**
   * @description
   * The Angular `ComponentFixture` of the component or the wrapper.
   * If a template is provided, it will be the fixture of the wrapper.
   *
   * For more info see https://angular.io/api/core/testing/ComponentFixture
   */
  fixture: ComponentFixture<WrapperType>;
}

export interface RenderOptions<Q extends Queries = typeof queries> {
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
   * An array of providers to be added to the testbed.
   */
  providers?: (Provider | EnvironmentProviders)[];
}

export interface RenderComponentOptions<Q extends Queries = typeof queries> extends RenderOptions<Q> {
  /**
   * @description
   * An array of bindings to apply to the component using Angular's native bindings API.
   * This provides a more direct way to bind inputs and outputs compared to the `inputs` and `on` options.
   *
   * @default
   * []
   *
   * @example
   * import { inputBinding, outputBinding, twoWayBinding } from '@angular/core';
   * import { signal } from '@angular/core';
   *
   * await render(AppComponent, {
   *   bindings: [
   *     inputBinding('value', () => 'test value'),
   *     outputBinding('click', (event) => console.log(event)),
   *     twoWayBinding('name', signal('initial value'))
   *   ]
   * })
   */
  bindings?: Binding[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RenderTemplateOptions<WrapperType, Properties extends object = {}, Q extends Queries = typeof queries>
  extends RenderOptions<Q> {
  /**
   * @description
   * An Angular component to wrap the component in.
   * The template will be overridden with the `template` option.
   * NOTE: A standalone component cannot be used as a wrapper.
   *
   * @default
   * `WrapperComponent`, a basic empty component.
   *
   * @example
   * await render(`<div spoiler message='SPOILER'></div>`, {
   *  declarations: [SpoilerDirective]
   *  wrapper: CustomWrapperComponent
   * })
   */
  wrapper?: Type<WrapperType>;

  wrapperProperties?: Partial<Properties>;

  /**
   * @description
   * An array of modules to be imported into the testbed.
   */
  imports?: any[];
}

export async function render<ComponentType>(
  component: Type<ComponentType>,
  renderOptions?: RenderComponentOptions,
): Promise<RenderResult<ComponentType, ComponentType>>;
export async function render<WrapperType = WrapperComponent>(
  template: string,
  renderOptions?: RenderTemplateOptions<WrapperType>,
): Promise<RenderResult<WrapperType>>;
export async function render<ComponentType, WrapperType = ComponentType>(
  componentOrTemplate: Type<ComponentType> | string,
  renderOptions: RenderComponentOptions | RenderTemplateOptions<WrapperType> = {},
): Promise<RenderResult<ComponentType, ComponentType | WrapperType>> {
  TestBed.configureTestingModule({
    declarations: [WrapperComponent],
    imports: 'imports' in renderOptions ? renderOptions.imports : [],
    providers: renderOptions.providers ?? [],
  });

  renderOptions.configureTestBed?.(TestBed);
  await TestBed.compileComponents();

  const fixture =
    typeof componentOrTemplate === 'string'
      ? await createWrapperFixture(componentOrTemplate, (renderOptions ?? {}) as RenderTemplateOptions<WrapperType>)
      : await createComponentFixture(componentOrTemplate, (renderOptions ?? {}) as RenderComponentOptions);

  return {
    fixture,
    container: fixture.nativeElement,
    debug: (element = fixture.nativeElement, maxLength?: number, options?: PrettyDOMOptions) => {
      if (Array.isArray(element)) {
        for (const e of element) {
          console.log(prettyDOM(e, maxLength, options));
        }
      } else {
        console.log(prettyDOM(element, maxLength, options));
      }
    },
    ...getQueriesForElement(fixture.nativeElement, renderOptions?.queries),
  };
}

async function createComponentFixture<SutType>(
  sut: Type<SutType>,
  options: RenderComponentOptions,
): Promise<ComponentFixture<SutType>> {
  return TestBed.createComponent(sut, { bindings: options.bindings || [] });
}

async function createWrapperFixture<WrapperType>(
  sut: string,
  options: RenderTemplateOptions<WrapperType>,
): Promise<ComponentFixture<WrapperType>> {
  const wrapper = options.wrapper ?? (WrapperComponent as Type<WrapperType>);
  TestBed.overrideTemplate(wrapper, sut);
  const fixture = TestBed.createComponent(wrapper);
  setWrapperProperties(fixture, options.wrapperProperties);
  return fixture;
}

function setWrapperProperties<SutType>(
  fixture: ComponentFixture<SutType>,
  wrapperProperties: RenderTemplateOptions<SutType, any>['wrapperProperties'] = {},
) {
  for (const key of Object.keys(wrapperProperties)) {
    const descriptor = Object.getOwnPropertyDescriptor((fixture.componentInstance as any).constructor.prototype, key);
    let _value = wrapperProperties[key];
    const defaultGetter = () => _value;
    const extendedSetter = (value: any) => {
      _value = value;
      descriptor?.set?.call(fixture.componentInstance, _value);
      fixture.changeDetectorRef.detectChanges();
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

@Component({ selector: 'atl-wrapper-component', template: '', standalone: false })
class WrapperComponent {}

export * from '@testing-library/dom';
