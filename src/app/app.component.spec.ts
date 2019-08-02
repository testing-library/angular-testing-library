import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { render } from '@testing-library/angular';
import { provideMock } from '@testing-library/angular/jest-utils';

import { AppComponent } from './app.component';
import { GreetService } from './greet.service';

test(`matches snapshot`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    providers: [provideMockStore()],
  });
  expect(container).toMatchSnapshot();
});

test(`should have a title`, async () => {
  const { getByText } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    providers: [provideMockStore()],
  });
  expect(getByText('Welcome to app!')).toBeDefined();
});

test(`should render title in a h1 tag`, async () => {
  const { container } = await render('<app-root></app-root>', {
    declarations: [AppComponent],
    providers: [provideMockStore()],
  });
  expect(container.querySelector('h1').textContent).toContain('Welcome to app!');
});

test(`should be able to get the Store`, async () => {
  await render('<app-root></app-root>', {
    declarations: [AppComponent],
    providers: [provideMockStore()],
  });
  expect(TestBed.get<Store<any>>(Store)).toBeDefined();
});

test(`should provide a mock greet service`, async () => {
  const component = await render(AppComponent, {
    declarations: [AppComponent],
    providers: [provideMockStore(), provideMock(GreetService)],
  });
  const service: GreetService = TestBed.get<GreetService>(GreetService);

  component.click(component.getByText('Greet'));

  expect(service.greet).toHaveBeenCalled();
});
