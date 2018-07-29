# ngx-testing-library

> Lightweight utility functions to test Angular components.

[![Build status][build-badge]][build]
[![npm][npm-badge]][npm]
[![Styled with prettier][prettier-badge]][prettier]
[![MIT License][license-badge]][license]
[![Code of Conduct][coc-badge]][coc]

## Table of Contents

- [Installation](#installation)
- [Why](#why)
- [What](#what)
- [How](#how)
- [Usage](#usage)
- [Licence](#license)

## Installation

Install `ngx-testing-library` from [npm] and add it your `devDependencies`:

`npm install ngx-testing-library --save-dev`

## Why

- test your UI components the way your users are using it
- making your tests resilient to implementation changes

## What

ngx-testing-library is an Angular adapter around [dom-testing-library][dom-testing-library],
which provides lightweight ulitity functions to test UI components. Your tests will work with actual DOM nodes.

## How

### `createComponent`

This library only consists of one function, `createComponent` which is used to setup the Angular `TestBed` and creates the component fixture.

This method can be used in two ways:

Based on a template:

```ts
import { createComponent } from 'ngx-testing-library';

createComponent('<my-component [prop]="1"></my-component>', options);
```

Based on a component type:

```ts
import { createComponent } from 'ngx-testing-library';

createComponent(
  {
    component: MyComponent,
    parameters: {
      prop: 1,
    },
  },
  options,
);
```

The second parameter in `createComponent` is the `options` parameter, which looks like this:

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

The `createComponent` function returns an object consisting all of the query functions from [dom-testing-library][dom-testing-library], all the event functions exposed from `fireEvent`, and adds the following properties:

> Every event runs `detectChanges` on the fixture.

#### `container: HTMLElement`

The DOM node containing the Angular component.

All of the [dom-testing-library][dom-testing-library] query functions are binded to this container.

#### `debug() => void`

Prints out the container.

#### `fixture: any`

The Angular fixture.

#### `getFromTestBed(token: any, notFoundValue?: any) => any`

Calls the the Angular `TestBed.get` function.

## Usage

You can find some examples in the [tests folder](https://github.com/timdeschryver/ngx-testing-library/tree/master/projects/ngx-testing-library/tests).

Here is how the "default" specifications can be written with `ngx-testing-library`.

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
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('my-awesome-app');
  }));

  it(`should render title in a h1 tag`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to my-awesome-app!');
  }));
});
```

After:

```ts
import { createComponent } from 'ngx-testing-library';
import { AppComponent } from './app.component';

it(`should have as title 'my-awesome-app'`, async () => {
  const { getByText } = await createComponent('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(getByText('Welcome to my-awesome-app!')).toBeDefined();
});

it(`should render title in a h1 tag`, async () => {
  const { container } = await createComponent(
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

[build-badge]: https://circleci.com/gh/timdeschryver/ngx-testing-library/tree/master.svg?style=shield
[build]: https://circleci.com/gh/timdeschryver/ngx-testing-library/tree/master
[prettier-badge]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier]: https://github.com/prettier/prettier
[npm-badge]: https://img.shields.io/npm/v/ngx-testing-library.svg
[npm]: https://www.npmjs.com/package/ngx-testing-library
[license-badge]: https://img.shields.io/npm/l/ngx-testing-library.svg?style=flat-square
[license]: https://github.com/timdeschryver/ngx-testing-library/blob/master/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/timdeschryver/ngx-testing-library/blob/master/CODE_OF_CONDUCT.md
[dom-testing-library]: https://github.com/kentcdodds/dom-testing-library
