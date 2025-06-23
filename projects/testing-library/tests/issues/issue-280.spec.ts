import { Location } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import userEvent from '@testing-library/user-event';
import { render, screen } from '../../src/public_api';

@Component({
  template: ` <div>Navigate</div>
    <router-outlet></router-outlet>`,
  imports: [RouterOutlet],
})
class MainComponent {}

@Component({
  template: ` <div>first page</div>
    <a routerLink="/second">go to second</a>`,
  imports: [RouterLink],
})
class FirstComponent {}

@Component({
  template: `<div>second page</div>
    <button (click)="goBack()">navigate back</button>`,
})
class SecondComponent {
  constructor(private location: Location) {}
  goBack() {
    this.location.back();
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/first', pathMatch: 'full' },
  { path: 'first', component: FirstComponent },
  { path: 'second', component: SecondComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
class AppRoutingModule {}

test('navigate to second page and back', async () => {
  await render(MainComponent, { imports: [AppRoutingModule, RouterTestingModule] });

  expect(await screen.findByText('Navigate')).toBeInTheDocument();
  expect(await screen.findByText('first page')).toBeInTheDocument();

  await userEvent.click(await screen.findByText('go to second'));

  expect(await screen.findByText('second page')).toBeInTheDocument();
  expect(await screen.findByText('navigate back')).toBeInTheDocument();

  await userEvent.click(await screen.findByText('navigate back'));

  expect(await screen.findByText('first page')).toBeInTheDocument();
});
