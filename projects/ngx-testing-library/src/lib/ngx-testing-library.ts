import { Component, NgModule, Type } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { getQueriesForElement, prettyDOM, fireEvent } from 'dom-testing-library';

import { Options, Result, ComponentInput } from './models';

@Component({ selector: 'test-component', template: '' })
class TestComponent {}

export async function createComponent<T>(template: string, options: Options): Promise<Result<T>>;
export async function createComponent<T>(component: ComponentInput<T>, options: Options): Promise<Result<T>>;
export async function createComponent<T>(
  templateOrComponent: string | ComponentInput<T>,
  { detectChanges = true, declarations = [], providers = [], imports = [], schemas = [] }: Options,
): Promise<Result<T>> {
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

  const eventsWithChangeDetection = Object.keys(fireEvent).reduce((events, key) => {
    events[key] = (element: HTMLElement, options?: {}) => {
      const result = fireEvent[key](element, options);
      fixture.detectChanges();
      return result;
    };
    return events;
  }, {});

  return {
    fixture,
    container: fixture.nativeElement,
    getFromTestBed: TestBed.get,
    debug: () => console.log(prettyDOM(fixture.nativeElement)),
    ...eventsWithChangeDetection,
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
