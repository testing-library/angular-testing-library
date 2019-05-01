import { Component, OnInit, ElementRef, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getQueriesForElement, prettyDOM, fireEvent, FireObject, FireFunction } from 'dom-testing-library';

import { RenderResult, RenderOptions, ComponentInput } from './models';

@Component({ selector: 'wrapper-component', template: '' })
class WrapperComponent implements OnInit {
  constructor(private elemtRef: ElementRef) {}

  ngOnInit() {
    this.elemtRef.nativeElement.removeAttribute('ng-version');
  }
}

export async function render<T>(template: string, renderOptions: RenderOptions): Promise<RenderResult>;
export async function render<T>(component: ComponentInput<T>, renderOptions: RenderOptions): Promise<RenderResult>;
export async function render<T>(
  templateOrComponent: string | ComponentInput<T>,
  {
    detectChanges = true,
    declarations = [],
    imports = [],
    providers = [],
    schemas = [],
    queries,
    wrapper = WrapperComponent,
  }: RenderOptions,
): Promise<RenderResult> {
  const isTemplate = typeof templateOrComponent === 'string';
  const testComponent = isTemplate ? [wrapper] : [];

  TestBed.configureTestingModule({
    declarations: [...declarations, ...testComponent],
    providers: [...providers],
    imports: [...imports],
    schemas: [...schemas],
  });

  const fixture = isTemplate
    ? createWrapperComponentFixture(wrapper, <string>templateOrComponent)
    : createComponentFixture(<ComponentInput<T>>templateOrComponent);

  await TestBed.compileComponents();

  if (detectChanges) {
    fixture.detectChanges();
  }

  const eventsWithDetectChanges = Object.keys(fireEvent).reduce(
    (events, key) => {
      events[key] = (element: HTMLElement, options?: {}) => {
        const result = fireEvent[key](element, options);
        fixture.detectChanges();
        return result;
      };
      return events;
    },
    {} as FireFunction & FireObject,
  );

  return {
    fixture,
    container: fixture.nativeElement,
    debug: (element = fixture.nativeElement) => console.log(prettyDOM(element)),
    ...getQueriesForElement(fixture.nativeElement, queries),
    ...eventsWithDetectChanges,
  } as any;
}

/**
 * Creates the wrapper component and sets its the template to the to-be-tested component
 */
function createWrapperComponentFixture<T>(wrapper: Type<T>, template: string) {
  TestBed.overrideComponent(wrapper, {
    set: {
      template: template,
    },
  });
  return TestBed.createComponent(wrapper);
}

/**
 * Creates the components and sets its properties via the provided properties from `componentInput`
 */
function createComponentFixture<T>(componentInput: ComponentInput<T>) {
  const { component, parameters = {} } = componentInput;
  const fixture = TestBed.createComponent(component);
  for (const key of Object.keys(parameters)) {
    fixture.componentInstance[key] = parameters[key];
  }
  return fixture;
}
