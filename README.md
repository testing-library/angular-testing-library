<div align="center">
<h1>@testing-library/angular</h1>

<a href="https://www.emojione.com/emoji/1f994">
  <img
    height="80"
    width="80"
    alt="hedgehog"
    src="https://raw.githubusercontent.com/testing-library/angular-testing-library/master/other/hedgehog.png"
  />
</a>

<p>Simple and complete Angular testing utilities that encourage good testing
practices.</p>

<br />

[**Read The Docs**](https://testing-library.com/angular) |
[Edit the docs](https://github.com/testing-library/testing-library-docs)

<br />
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]
[![Join the community on Spectrum][spectrum-badge]][spectrum]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]
<!-- prettier-ignore-end -->

<div align="center">
  <a href="https://testingjavascript.com">
    <img
      width="500"
      alt="TestingJavaScript.com Learn the smart, efficient way to test any JavaScript application."
      src="https://raw.githubusercontent.com/testing-library/react-testing-library/master/other/testingjavascript.jpg"
    />
  </a>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The problem](#the-problem)
- [This solution](#this-solution)
- [Example](#example)
- [Installation](#installation)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [Docs](#docs)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
  - [❓ Questions](#-questions)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The problem

You want to write maintainable tests for your Angular components. As a part of
this goal, you want your tests to avoid including implementation details of your
components and rather focus on making your tests give you the confidence for
which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

## This solution

The `@testing-library/angular` is a very lightweight solution for
testing Angular components. It provides light utility functions on top of `Angular`
and `@testing-library/dom`, in a way that encourages better testing practices. Its
primary guiding principle is:

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

## Example

counter.component.ts

```ts
@Component({
  selector: 'counter',
  template: `
    <button (click)="decrement()">-</button>
    <span>Current Count: {{ counter }}</span>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  @Input() counter = 0;

  increment() {
    this.counter += 1;
  }

  decrement() {
    this.counter -= 1;
  }
}
```

counter.component.spec.ts

```typescript
import { render, screen, fireEvent } from '@testing-library/angular';
import { CounterComponent } from './counter.component.ts';

describe('Counter', () => {
  test('should render counter', async () => {
    await render(CounterComponent, { componentProperties: { counter: 5 } });

    expect(screen.getByText('Current Count: 5'));
  });

  test('should increment the counter on click', async () => {
    await render(CounterComponent, { componentProperties: { counter: 5 } });

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);

    expect(screen.getByText('Current Count: 6'));
  });
});
```

[See more examples](https://github.com/testing-library/angular-testing-library/tree/master/src/app/examples)

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```bash
npm install @testing-library/angular --save-dev
```

You may also be interested in installing `jest-dom` so you can use
[the custom jest matchers](https://github.com/testing-library/jest-dom#readme).

> [**Docs**](https://testing-library.com/angular)

## Guiding Principles

> [The more your tests resemble the way your software is used, the more
> confidence they can give you.][guiding-principle]

We try to only expose methods and utilities that encourage you to write tests
that closely resemble how your Angular components are used.

Utilities are included in this project based on the following guiding
principles:

1.  If it relates to rendering components, it deals with DOM nodes rather than
    component instances, nor should it encourage dealing with component
    instances.
2.  It should be generally useful for testing individual Angular components or
    full Angular applications.
3.  Utility implementations and APIs should be simple and flexible.

At the end of the day, what we want is for this library to be pretty
light-weight, simple, and understandable.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://timdeschryver.dev"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4" width="100px;" alt=""/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=timdeschryver" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=timdeschryver" title="Documentation">📖</a> <a href="#infra-timdeschryver" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=timdeschryver" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4" width="100px;" alt=""/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=MichaelDeBoey" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/flakolefluk"><img src="https://avatars0.githubusercontent.com/u/11986564?v=4" width="100px;" alt=""/><br /><sub><b>Ignacio Le Fluk</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=flakolefluk" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=flakolefluk" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://hu.linkedin.com/pub/tamas-szabo/57/a4b/242"><img src="https://avatars0.githubusercontent.com/u/3720079?v=4" width="100px;" alt=""/><br /><sub><b>Tamás Szabó</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=szabototo89" title="Code">💻</a></td>
    <td align="center"><a href="https://medium.com/@gregor.woiwode"><img src="https://avatars3.githubusercontent.com/u/444278?v=4" width="100px;" alt=""/><br /><sub><b>Gregor Woiwode</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=GregOnNet" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tonivj5"><img src="https://avatars2.githubusercontent.com/u/7110786?v=4" width="100px;" alt=""/><br /><sub><b>Toni Villena</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/issues?q=author%3Atonivj5" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=tonivj5" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=tonivj5" title="Documentation">📖</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=tonivj5" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## Docs

[**Read The Docs**](https://testing-library.com/angular) |
[Edit the docs](https://github.com/testing-library/testing-library-docs)

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

[**See Feature Requests**][requests]

### ❓ Questions

For questions related to using the library, please visit a support community
instead of filing an issue on GitHub.

- [Spectrum][spectrum]
- [Stack Overflow][stackoverflow]

## LICENSE

MIT

<!--
Links:
-->

<!-- prettier-ignore-start -->

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://circleci.com/gh/testing-library/angular-testing-library/tree/master.svg?style=shield
[build]: https://circleci.com/gh/testing-library/angular-testing-library/tree/master
[coverage]: https://codecov.io/github/testing-library/angular-testing-library
[coverage-badge]: https://img.shields.io/codecov/c/github/testing-library/angular-testing-library.svg?style=flat-square
[version-badge]: https://img.shields.io/npm/v/@testing-library/angular.svg?style=flat-square
[package]: https://www.npmjs.com/package/@testing-library/angular
[downloads-badge]: https://img.shields.io/npm/dm/@testing-library/angular.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/@testing-library/angular
[spectrum-badge]: https://withspectrum.github.io/badge/badge.svg
[spectrum]: https://spectrum.chat/testing-library
[license-badge]: https://img.shields.io/npm/l/@testing-library/angular.svg?style=flat-square
[license]: https://github.com/testing-library/angular-testing-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/testing-library/angular-testing-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/testing-library/angular-testing-library.svg?style=social
[github-watch]: https://github.com/testing-library/angular-testing-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/testing-library/angular-testing-library.svg?style=social
[github-star]: https://github.com/testing-library/angular-testing-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20🦔%20@testing-library/angular%20by%20%40tim_deschryver%20https%3A%2F%2Fgithub.com%2F@testing-library/angular
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/testing-library/angular-testing-library.svg?style=social
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[set-immediate]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
[guiding-principle]: https://twitter.com/kentcdodds/status/977018512689455106
[bugs]: https://github.com/testing-library/angular-testing-library/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acreated-desc
[requests]: https://github.com/testing-library/angular-testing-library/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc+label%3Aenhancement+is%3Aopen
[good-first-issue]: https://github.com/testing-library/angular-testing-library/issues?utf8=✓&q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc+label%3A"good+first+issue"+
[stackoverflow]: https://stackoverflow.com/questions/tagged/angular-testing-library
[contributors-badge]: https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square

<!-- prettier-ignore-end -->
