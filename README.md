# @angular-extensions/testing-library

Lightweight utility functions to test Angular components.

[**Read The Docs**](https://testing-library.com/angular) | [Edit the docs](https://github.com/alexkrolick/testing-library-docs)

<hr />

[![Build status][build-badge]][build]

[![npm][npm-badge]][npm]

[![Semantically released][sr-badge]][sr]

[![Styled with prettier][prettier-badge]][prettier]

[![MIT License][license-badge]][license]

[![Code of Conduct][coc-badge]][coc]

## Table of Contents

- [Installation](#installation)
- [Why](#why)
- [What](#what)
- [How](#how)
  - [`render`](#render)
    - [`container: HTMLElement`](#container-htmlelement)
    - [`debug(element: HTMLElement) => void`](#debug--void)
    - [`fixture: any`](#fixture-any)
- [Usage](#usage)
- [LICENSE](#license)

## Installation

Install `@angular-extensions/testing-library` from [npm] and add it your `devDependencies`:

`npm install @angular-extensions/testing-library --save-dev`

## Why

- test your UI components the way your users are using it
- making your tests resilient to implementation changes

## What

`@angular-extensions/testing-library` is an Angular adapter around [dom-testing-library][dom-testing-library],
which provides lightweight utility functions to test UI components. Your tests will work with actual DOM nodes.

## How

### `render`

This library only consists of one function, `render` which is used to setup the Angular `TestBed` and creates the component fixture.

This method can be used in two ways:

Based on a template:

```ts
import { render } from '@angular-extensions/testing-library';

render('<my-component [prop]="1"></my-component>', options);
```

Based on a component type:

```ts
import { render } from '@angular-extensions/testing-library';

render(
  {
    component: MyComponent,
    parameters: {
      prop: 1,
    },
  },
  options,
);
```

The second parameter in `render` is the `options` parameter, which looks like this:

```ts
{
  detectChanges?: boolean = true;
  declarations: any[] = [];
  providers?: any[] = [];
  imports?: any[] = [];
  schemas?: any[] = [];
}
```

`detectChanges`: runs `detectChanges` on the fixture

`declarations`: passed to the `TestBed`

`providers`: passed to the `TestBed`

`imports`: passed to the `TestBed`

`schemas`: passed to the `TestBed`

The `render` function returns an object consisting all of the query functions from [dom-testing-library][dom-testing-library], all the event functions exposed from `fireEvent`, and adds the following properties:

> Every event runs `detectChanges` on the fixture.

#### `container: HTMLElement`

The DOM node containing the Angular component.

All of the [dom-testing-library][dom-testing-library] query functions are binded to this container.

#### `debug(element: HTMLElement) => void`

Prints out the container.

#### `fixture: any`

The Angular fixture.

## Usage

You can find some examples in the [tests folder](https://github.com/angular-extensions/testing-library/tree/master/projects/testing-library/tests).

Here is how the "default" specifications can be written with `@angular-extensions/testing-library`.

Before:

```ts
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  }));

  it(`should have as title 'my-awesome-app'`, async(() => {
    const fixture = TestBed.render(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('my-awesome-app');
  }));

  it(`should render title in a h1 tag`, async(() => {
    const fixture = TestBed.render(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to my-awesome-app!');
  }));
});
```

After:

```ts
import { render } from '@angular-extensions/testing-library';
import { AppComponent } from './app.component';

it(`should have as title 'my-awesome-app'`, async () => {
  const { getByText } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(getByText('Welcome to my-awesome-app!')).toBeDefined();
});

it(`should render title in a h1 tag`, async () => {
  const { container } = await render(
    {
      component: AppComponent,
    },
    {
      declarations: [AppComponent],
    },
  );
  expect(container.querySelector('h1').textContent).toContain('Welcome to my-awesome-app!');
});
```

## LICENSE

MIT

[build-badge]: https://circleci.com/gh/angular-extensions/testing-library/tree/master.svg?style=shield
[build]: https://circleci.com/gh/angular-extensions/testing-library/tree/master
[sr-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[sr]: https://github.com/semantic-release/semantic-release
[prettier-badge]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier]: https://github.com/prettier/prettier
[npm-badge]: https://img.shields.io/npm/v/@angular-extensions/testing-library.svg
[npm]: https://www.npmjs.com/package/@angular-extensions/testing-library
[license-badge]: https://img.shields.io/npm/l/@angular-extensions/testing-library.svg?style=flat-square
[license]: https://github.com/angular-extensions/testing-library/blob/master/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/angular-extensions/testing-library/blob/master/CODE_OF_CONDUCT.md
[dom-testing-library]: https://testing-library.com/
