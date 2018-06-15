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
  const extraDeclarations = isTemplate ? [TestComponent] : [];

  TestBed.configureTestingModule({
    declarations: [...declarations, ...extraDeclarations],
    providers: [...providers],
    imports: [...imports],
    schemas: [...schemas],
  });

  if (isTemplate) {
    TestBed.overrideComponent(TestComponent, {
      set: {
        template: <string>templateOrComponent,
      },
    });
  }

  await TestBed.compileComponents();

  let fixture;
  if (isTemplate) {
    fixture = TestBed.createComponent(TestComponent);
    if (detectChanges) {
      fixture.detectChanges();
    }
  } else {
    const { component, parameters = [] } = <ComponentInput<T>>templateOrComponent;
    fixture = TestBed.createComponent(component);
    for (const key of Object.keys(parameters)) {
      fixture.componentInstance[key] = parameters[key];
    }
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
