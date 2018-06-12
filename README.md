# NgxTestingLibraryApp

Test your Angular components with the [dom-testing-library](https://github.com/kentcdodds/dom-testing-library).

Go from

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

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to my-awesome-app!');
  }));
});
```

to

```ts
import { AppComponent } from './app.component';
import { createComponent } from 'ngx-testing-library';

test(`should have as title 'my-awesome-app'`, async () => {
  const { detectChanges, getByText } = await createComponent('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(getByText('Welcome to my-awesome-app!')).toBeDefined();
});

test(`should render title in a h1 tag`, async () => {
  const { container } = await createComponent('<app-root></app-root>', {
    declarations: [AppComponent],
  });
  expect(container.querySelector('h1').textContent).toContain('Welcome to my-awesome-app!');
});
```
