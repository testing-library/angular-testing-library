<div align="center">
<h1>@testing-library/angular</h1>

<img
  height="80"
  width="80"
  alt="Octopus with the Angular logo"
  src="https://raw.githubusercontent.com/testing-library/angular-testing-library/main/other/logo-icon.svg"
/>

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
[![version][version-badge]][package] [![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]
[![Discord][discord-badge]][discord]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]
<!-- prettier-ignore-end -->

<div align="center">
  <a href="https://testingjavascript.com">
    <img
      width="500"
      alt="TestingJavaScript.com Learn the smart, efficient way to test any JavaScript application."
      src="https://raw.githubusercontent.com/testing-library/react-testing-library/main/other/testingjavascript.jpg"
    />
  </a>
</div>

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=137053739)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Table of Contents](#table-of-contents)
- [The problem](#the-problem)
- [This solution](#this-solution)
- [Example](#example)
- [Installation](#installation)
- [Version compatibility](#version-compatibility)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [Docs](#docs)
- [FAQ](#faq)
  - [I am using Reactive Forms and the `jest-dom` matcher `toHaveFormValues` always returns an empty object or there are missing fields. Why?](#i-am-using-reactive-forms-and-the-jest-dom-matcher-tohaveformvalues-always-returns-an-empty-object-or-there-are-missing-fields-why)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
  - [❓ Questions](#-questions)
- [Getting started with GitHub Codespaces](#getting-started-with-github-codespaces)
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
  selector: 'app-counter',
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
import { CounterComponent } from './counter.component';

describe('Counter', () => {
  test('should render counter', async () => {
    await render(CounterComponent, { componentProperties: { counter: 5 } });

    expect(screen.getByText('Current Count: 5'));
  });

  test('should increment the counter on click', async () => {
    await render(CounterComponent, { componentProperties: { counter: 5 } });

    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);

    expect(screen.getByText('Current Count: 6'));
  });
});
```

[See more examples](https://github.com/testing-library/angular-testing-library/tree/main/apps/example-app/src/app/examples)

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```bash
npm install @testing-library/angular --save-dev
```

You may also be interested in installing `jest-dom` so you can use
[the custom jest matchers](https://github.com/testing-library/jest-dom#readme).

> [**Docs**](https://testing-library.com/angular)

## Version compatibility

| Angular | Angular Testing Library |
| ------- | ----------------------- |
| 17.x    | 15.x, 14.x, 13.x        |
| 16.x    | 14.x, 13.x              |
| >= 15.1 | 14.x, 13.x              |
| < 15.1  | 12.x, 11.x              |
| 14.x    | 12.x, 11.x              |

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
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://timdeschryver.dev"><img src="https://avatars1.githubusercontent.com/u/28659384?v=4?s=100" width="100px;" alt="Tim Deschryver"/><br /><sub><b>Tim Deschryver</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=timdeschryver" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=timdeschryver" title="Documentation">📖</a> <a href="#infra-timdeschryver" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=timdeschryver" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://michaeldeboey.be"><img src="https://avatars3.githubusercontent.com/u/6643991?v=4?s=100" width="100px;" alt="Michaël De Boey"/><br /><sub><b>Michaël De Boey</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=MichaelDeBoey" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/flakolefluk"><img src="https://avatars0.githubusercontent.com/u/11986564?v=4?s=100" width="100px;" alt="Ignacio Le Fluk"/><br /><sub><b>Ignacio Le Fluk</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=flakolefluk" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=flakolefluk" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://hu.linkedin.com/pub/tamas-szabo/57/a4b/242"><img src="https://avatars0.githubusercontent.com/u/3720079?v=4?s=100" width="100px;" alt="Tamás Szabó"/><br /><sub><b>Tamás Szabó</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=szabototo89" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://medium.com/@gregor.woiwode"><img src="https://avatars3.githubusercontent.com/u/444278?v=4?s=100" width="100px;" alt="Gregor Woiwode"/><br /><sub><b>Gregor Woiwode</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=GregOnNet" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tonivj5"><img src="https://avatars2.githubusercontent.com/u/7110786?v=4?s=100" width="100px;" alt="Toni Villena"/><br /><sub><b>Toni Villena</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/issues?q=author%3Atonivj5" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=tonivj5" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=tonivj5" title="Documentation">📖</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=tonivj5" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ShPelles"><img src="https://avatars0.githubusercontent.com/u/43875468?v=4?s=100" width="100px;" alt="ShPelles"/><br /><sub><b>ShPelles</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=ShPelles" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/miluoshi"><img src="https://avatars1.githubusercontent.com/u/1130547?v=4?s=100" width="100px;" alt="Miluoshi"/><br /><sub><b>Miluoshi</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=miluoshi" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=miluoshi" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://nickmccurdy.com/"><img src="https://avatars0.githubusercontent.com/u/927220?v=4?s=100" width="100px;" alt="Nick McCurdy"/><br /><sub><b>Nick McCurdy</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=nickmccurdy" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SrinivasanTarget"><img src="https://avatars2.githubusercontent.com/u/8896549?v=4?s=100" width="100px;" alt="Srinivasan Sekar"/><br /><sub><b>Srinivasan Sekar</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=SrinivasanTarget" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/serkan-sipahi-59b20081/"><img src="https://avatars2.githubusercontent.com/u/1880749?v=4?s=100" width="100px;" alt="Bitcollage"/><br /><sub><b>Bitcollage</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=SerkanSipahi" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/krokofant"><img src="https://avatars0.githubusercontent.com/u/5908498?v=4?s=100" width="100px;" alt="Emil Sundin"/><br /><sub><b>Emil Sundin</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=krokofant" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Ombrax"><img src="https://avatars0.githubusercontent.com/u/7486723?v=4?s=100" width="100px;" alt="Ombrax"/><br /><sub><b>Ombrax</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=Ombrax" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rafaelss95"><img src="https://avatars0.githubusercontent.com/u/11965907?v=4?s=100" width="100px;" alt="Rafael Santana"/><br /><sub><b>Rafael Santana</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=rafaelss95" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=rafaelss95" title="Tests">⚠️</a> <a href="https://github.com/testing-library/angular-testing-library/issues?q=author%3Arafaelss95" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/B_Blackwo"><img src="https://avatars0.githubusercontent.com/u/7598058?v=4?s=100" width="100px;" alt="Benjamin Blackwood"/><br /><sub><b>Benjamin Blackwood</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=BBlackwo" title="Documentation">📖</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=BBlackwo" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://gustavoporto.dev"><img src="https://avatars2.githubusercontent.com/u/3718120?v=4?s=100" width="100px;" alt="Gustavo Porto"/><br /><sub><b>Gustavo Porto</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=portothree" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://wwww.reibo.be"><img src="https://avatars1.githubusercontent.com/u/1673799?v=4?s=100" width="100px;" alt="Bo Vandersteene"/><br /><sub><b>Bo Vandersteene</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=bovandersteene" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jbchr"><img src="https://avatars1.githubusercontent.com/u/23141806?v=4?s=100" width="100px;" alt="Janek"/><br /><sub><b>Janek</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=jbchr" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=jbchr" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/GlebIrovich"><img src="https://avatars.githubusercontent.com/u/33176414?v=4?s=100" width="100px;" alt="Gleb Irovich"/><br /><sub><b>Gleb Irovich</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=GlebIrovich" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=GlebIrovich" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/the-ult"><img src="https://avatars.githubusercontent.com/u/4863062?v=4?s=100" width="100px;" alt="Arjen"/><br /><sub><b>Arjen</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=the-ult" title="Code">💻</a> <a href="#maintenance-the-ult" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://lacolaco.net"><img src="https://avatars.githubusercontent.com/u/1529180?v=4?s=100" width="100px;" alt="Suguru Inatomi"/><br /><sub><b>Suguru Inatomi</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=lacolaco" title="Code">💻</a> <a href="#ideas-lacolaco" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/amitmiran137"><img src="https://avatars.githubusercontent.com/u/47772523?v=4?s=100" width="100px;" alt="Amit Miran"/><br /><sub><b>Amit Miran</b></sub></a><br /><a href="#infra-amitmiran137" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jwillebrands"><img src="https://avatars.githubusercontent.com/u/8925?v=4?s=100" width="100px;" alt="Jan-Willem Willebrands"/><br /><sub><b>Jan-Willem Willebrands</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=jwillebrands" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.sandroroth.com"><img src="https://avatars.githubusercontent.com/u/16229645?v=4?s=100" width="100px;" alt="Sandro"/><br /><sub><b>Sandro</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=rothsandro" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/issues?q=author%3Arothsandro" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/michaelwestphal"><img src="https://avatars.githubusercontent.com/u/1829174?v=4?s=100" width="100px;" alt="Michael Westphal"/><br /><sub><b>Michael Westphal</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=michaelwestphal" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=michaelwestphal" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Lukas-Kullmann"><img src="https://avatars.githubusercontent.com/u/387547?v=4?s=100" width="100px;" alt="Lukas"/><br /><sub><b>Lukas</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=Lukas-Kullmann" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://matan.io"><img src="https://avatars.githubusercontent.com/u/12711091?v=4?s=100" width="100px;" alt="Matan Borenkraout"/><br /><sub><b>Matan Borenkraout</b></sub></a><br /><a href="#maintenance-MatanBobi" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mleimer"><img src="https://avatars.githubusercontent.com/u/14271564?v=4?s=100" width="100px;" alt="mleimer"/><br /><sub><b>mleimer</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=mleimer" title="Documentation">📖</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=mleimer" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/meirka"><img src="https://avatars.githubusercontent.com/u/750901?v=4?s=100" width="100px;" alt="MeIr"/><br /><sub><b>MeIr</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/issues?q=author%3Ameirka" title="Bug reports">🐛</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=meirka" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jadengis"><img src="https://avatars.githubusercontent.com/u/13421336?v=4?s=100" width="100px;" alt="John Dengis"/><br /><sub><b>John Dengis</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=jadengis" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=jadengis" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dzonatan"><img src="https://avatars.githubusercontent.com/u/5166666?v=4?s=100" width="100px;" alt="Rokas Brazdžionis"/><br /><sub><b>Rokas Brazdžionis</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=dzonatan" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mateusduraes"><img src="https://avatars.githubusercontent.com/u/19319404?v=4?s=100" width="100px;" alt="Mateus Duraes"/><br /><sub><b>Mateus Duraes</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=mateusduraes" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/JJosephttg"><img src="https://avatars.githubusercontent.com/u/23690250?v=4?s=100" width="100px;" alt="Josh Joseph"/><br /><sub><b>Josh Joseph</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=JJosephttg" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=JJosephttg" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/shaman-apprentice"><img src="https://avatars.githubusercontent.com/u/3596742?v=4?s=100" width="100px;" alt="Torsten Knauf"/><br /><sub><b>Torsten Knauf</b></sub></a><br /><a href="#maintenance-shaman-apprentice" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/antischematic"><img src="https://avatars.githubusercontent.com/u/12976684?v=4?s=100" width="100px;" alt="antischematic"/><br /><sub><b>antischematic</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/issues?q=author%3Aantischematic" title="Bug reports">🐛</a> <a href="#ideas-antischematic" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TrustNoOneElse"><img src="https://avatars.githubusercontent.com/u/25935352?v=4?s=100" width="100px;" alt="Florian Pabst"/><br /><sub><b>Florian Pabst</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=TrustNoOneElse" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://rochesterparks.org"><img src="https://avatars.githubusercontent.com/u/9759954?v=4?s=100" width="100px;" alt="Mark Goho"/><br /><sub><b>Mark Goho</b></sub></a><br /><a href="#maintenance-markgoho" title="Maintenance">🚧</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=markgoho" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://jwbaart.dev"><img src="https://avatars.githubusercontent.com/u/10973990?v=4?s=100" width="100px;" alt="Jan-Willem Baart"/><br /><sub><b>Jan-Willem Baart</b></sub></a><br /><a href="https://github.com/testing-library/angular-testing-library/commits?author=jwbaart" title="Code">💻</a> <a href="https://github.com/testing-library/angular-testing-library/commits?author=jwbaart" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## Docs

[**Read The Docs**](https://testing-library.com/angular) |
[Edit the docs](https://github.com/testing-library/testing-library-docs)

## FAQ

### I am using Reactive Forms and the `jest-dom` matcher `toHaveFormValues` always returns an empty object or there are missing fields. Why?

Only form elements with a `name` attribute will have their values passed to `toHaveFormsValues`.

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

- [Discord][discord]
- [Stack Overflow][stackoverflow]

## Getting started with GitHub Codespaces

To get started, create a codespace for this repository by clicking this 👇

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=137053739)

A codespace will open in a web-based version of Visual Studio Code. The [dev container](.devcontainer/devcontainer.json) is fully configured with software needed for this project.

**Note**: Dev containers is an open spec which is supported by [GitHub Codespaces](https://github.com/codespaces) and [other tools](https://containers.dev/supporting).

## LICENSE

MIT

<!--
Links:
-->

<!-- prettier-ignore-start -->

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://github.com/testing-library/angular-testing-library/actions/workflows/ci.yml/badge.svg
[build]: https://github.com/testing-library/angular-testing-library/actions/workflows/ci.yml
[version-badge]: https://img.shields.io/npm/v/@testing-library/angular.svg?style=flat-square
[package]: https://www.npmjs.com/package/@testing-library/angular
[downloads-badge]: https://img.shields.io/npm/dm/@testing-library/angular.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/@testing-library/angular
[discord-badge]: https://img.shields.io/discord/723559267868737556.svg?color=7389D8&labelColor=6A7EC2&logo=discord&logoColor=ffffff&style=flat-square
[discord]: https://discord.gg/testing-library
[license-badge]: https://img.shields.io/npm/l/@testing-library/angular.svg?style=flat-square
[license]: https://github.com/testing-library/angular-testing-library/blob/main/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/testing-library/angular-testing-library/blob/main/CODE_OF_CONDUCT.md
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
