import { Component, NgModule } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { getQueriesForElement, prettyDOM } from 'dom-testing-library';

@Component({ selector: 'test-component', template: '' })
class TestComponent {}

export async function createComponent(
  template: string,
  { detectChanges = true, declarations = [], providers = [], imports = [], schemas = [] } = {},
): Promise<{
  container: any;
  get: (token: any, notFoundValue?: any) => any;
  getComponentInstance: <T>(selector: string) => T;
  debug: () => void;
  detectChanges: (checkNoChanges?: boolean) => void;
  fixture: any;
  queryByPlaceholderText: any;
  queryAllByPlaceholderText: any;
  getByPlaceholderText: any;
  getAllByPlaceholderText: any;
  queryByText: any;
  queryAllByText: any;
  getByText: any;
  getAllByText: any;
  queryByLabelText: any;
  queryAllByLabelText: any;
  getByLabelText: any;
  getAllByLabelText: any;
  queryByAltText: any;
  queryAllByAltText: any;
  getByAltText: any;
  getAllByAltText: any;
  queryByTestId: any;
  queryAllByTestId: any;
  getByTestId: any;
  getAllByTestId: any;
  queryByTitle: any;
  queryAllByTitle: any;
  getByTitle: any;
  getAllByTitle: any;
  queryByValue: any;
  queryAllByValue: any;
  getByValue: any;
  getAllByValue: any;
}> {
  TestBed.configureTestingModule({
    declarations: [TestComponent, ...declarations],
    providers: [...providers],
    imports: [...imports],
    schemas: [...schemas],
  });

  TestBed.overrideComponent(TestComponent, {
    set: {
      template,
    },
  });

  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(TestComponent);
  if (detectChanges) {
    fixture.detectChanges();
  }

  // Currently this isn't perfect because the typings from dom-testing-library are for TS 2.8
  return {
    fixture,
    container: fixture.nativeElement,
    get: TestBed.get,
    getComponentInstance: <T>(selector: string) => fixture.debugElement.query(By.css(selector)).componentInstance as T,
    debug: () => console.log(prettyDOM(fixture.nativeElement)),
    detectChanges: (checkNoChanges?: boolean) => fixture.detectChanges(checkNoChanges),
    ...getQueriesForElement(fixture.nativeElement),
  };
}
