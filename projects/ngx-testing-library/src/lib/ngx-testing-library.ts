import { Component, NgModule, Type } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { getQueriesForElement, prettyDOM } from 'dom-testing-library';

import { Options, Result, ComponentInput } from './models';

@Component({ selector: 'test-component', template: '' })
class TestComponent {}

export async function createComponent(template: string, options: Options): Promise<Result>;
export async function createComponent<T>(component: ComponentInput<T>, options: Options): Promise<Result>;
export async function createComponent<T>(
  templateOrComponent: string | ComponentInput<T>,
  { detectChanges = true, declarations = [], providers = [], imports = [], schemas = [] }: Options,
): Promise<Result> {
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

  // Currently this isn't perfect because the typings from dom-testing-library are for TS 2.8
  return {
    fixture,
    container: fixture.nativeElement,
    get: TestBed.get,
    getComponentInstance: <C>(selectorOrComponent: string | C) =>
      typeof selectorOrComponent === 'string'
        ? fixture.debugElement.query(By.css(selectorOrComponent)).componentInstance
        : fixture.componentInstance,
    debug: () => console.log(prettyDOM(fixture.nativeElement)),
    detectChanges: (checkNoChanges?: boolean) => fixture.detectChanges(checkNoChanges),
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
