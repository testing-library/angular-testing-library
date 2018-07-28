import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getQueriesForElement, prettyDOM, fireEvent, FireFunction, FireObject } from 'dom-testing-library';

import { Options, RenderResult, ComponentInput } from './models';

@Component({ selector: 'test-component', template: '' })
class TestComponent {}

export async function createComponent<T>(template: string, options: Options): Promise<RenderResult>;
export async function createComponent<T>(component: ComponentInput<T>, options: Options): Promise<RenderResult>;
export async function createComponent<T>(
  templateOrComponent: string | ComponentInput<T>,
  { detectChanges = true, declarations = [], providers = [], imports = [], schemas = [] }: Options,
): Promise<RenderResult> {
  const isTemplate = typeof templateOrComponent === 'string';
  const testComponent = isTemplate ? [TestComponent] : [];

  TestBed.configureTestingModule({
    declarations: [...declarations, ...testComponent],
    providers: [...providers],
    imports: [...imports],
    schemas: [...schemas],
  });

  const fixture = isTemplate
    ? createTestComponentFixture(<string>templateOrComponent)
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
    {} as FireObject,
  );

  return {
    fixture,
    container: fixture.nativeElement,
    getFromTestBed: TestBed.get,
    debug: () => console.log(prettyDOM(fixture.nativeElement)),
    ...eventsWithDetectChanges,
    ...getQueriesForElement(fixture.nativeElement),
  };
}

function createTestComponentFixture(template: string) {
  TestBed.overrideComponent(TestComponent, {
    set: {
      template: template,
    },
  });
  return TestBed.createComponent(TestComponent);
}

function createComponentFixture<T>(componentInput: ComponentInput<T>) {
  const { component, parameters = {} } = componentInput;
  const fixture = TestBed.createComponent(component);
  for (const key of Object.keys(parameters)) {
    fixture.componentInstance[key] = parameters[key];
  }
  return fixture;
}
