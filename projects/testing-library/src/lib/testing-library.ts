import { Component, OnInit, ElementRef, Type, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { getQueriesForElement, prettyDOM, fireEvent, FireObject, FireFunction } from 'dom-testing-library';
import { RenderResult, RenderOptions } from './models';

@Component({ selector: 'wrapper-component', template: '' })
class WrapperComponent implements OnInit {
  constructor(private elemtRef: ElementRef) {}

  ngOnInit() {
    this.elemtRef.nativeElement.removeAttribute('ng-version');
  }
}

export async function render<T>(
  templateOrComponent: string | Type<T>,
  {
    detectChanges = true,
    declarations = [],
    imports = [],
    providers = [],
    schemas = [],
    queries,
    wrapper = WrapperComponent,
    componentProperties = {},
  }: RenderOptions<T>,
): Promise<RenderResult> {
  const isTemplate = typeof templateOrComponent === 'string';
  const componentDeclarations = isTemplate ? [wrapper] : [templateOrComponent];

  TestBed.configureTestingModule({
    declarations: [...declarations, ...componentDeclarations],
    imports: [...imports],
    schemas: [...schemas],
  });

  if (providers) {
    // override services this way to have the service overridden at the component level
    providers.forEach(p => {
      const { provide, ...provider } = p;
      TestBed.overrideProvider(provide, provider);
    });
  }

  const fixture = isTemplate
    ? createWrapperComponentFixture(templateOrComponent as string, { wrapper, componentProperties })
    : createComponentFixture(templateOrComponent as Type<T>, { componentProperties });

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
function createWrapperComponentFixture<T>(
  template: string,
  {
    wrapper,
    componentProperties,
  }: {
    wrapper: RenderOptions<T>['wrapper'];
    componentProperties: RenderOptions<T>['componentProperties'];
  },
): ComponentFixture<any> {
  TestBed.overrideComponent(wrapper, {
    set: {
      template: template,
    },
  });

  const fixture = TestBed.createComponent(wrapper);
  // get the component selector, e.g. <foo color="green"> and <foo> results in foo
  const componentSelector = template.match(/\<(.*?)\ /) || template.match(/\<(.*?)\>/);
  if (!componentSelector) {
    throw Error(`Template ${template} is not valid.`);
  }

  const sut = fixture.debugElement.query(By.css(componentSelector[1]));
  setComponentProperties(sut, { componentProperties });
  return fixture;
}

/**
 * Creates the components and sets its properties
 */
function createComponentFixture<T>(
  component: Type<T>,
  {
    componentProperties = {},
  }: {
    componentProperties: RenderOptions<T>['componentProperties'];
  },
): ComponentFixture<T> {
  const fixture = TestBed.createComponent(component);
  setComponentProperties(fixture, { componentProperties });
  return fixture;
}

/**
 * Set the component properties
 */
function setComponentProperties<T>(
  fixture: ComponentFixture<T> | DebugElement,
  {
    componentProperties = {},
  }: {
    componentProperties: RenderOptions<T>['componentProperties'];
  },
) {
  for (const key of Object.keys(componentProperties)) {
    fixture.componentInstance[key] = componentProperties[key];
  }
  return fixture;
}
