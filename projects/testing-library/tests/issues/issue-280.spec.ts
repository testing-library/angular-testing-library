import {Component, NgModule} from '@angular/core';
import {render, screen} from '../../src/public_api';
import {RouterModule, Routes} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {click} from "@testing-library/user-event/dist/click";
import {Location} from "@angular/common";

@Component({
  template: `<div>Navigate</div> <router-outlet></router-outlet>`,
})
class MainComponent {}

@Component({
  template: `<div>first page</div><a routerLink="/second">go to second</a>`
})
class FirstComponent {}

@Component({
  template: `<div>second page</div><button (click)="goBack()">navigate back</button>`
})
class SecondComponent {
  constructor(private location: Location) { }
  goBack() {this.location.back();}
}

const routes: Routes = [
  {path: '', redirectTo: '/first', pathMatch: 'full'},
  {path: 'first', component: FirstComponent},
  {path: 'second', component: SecondComponent}
];

@NgModule({
  declarations: [FirstComponent, SecondComponent],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
class AppRoutingModule {}


test('navigate to second page and back', async () => {
  const subject = await render(MainComponent, {imports: [AppRoutingModule, RouterTestingModule]});
  await subject.navigate('/');

  expect(await screen.findByText('Navigate')).toBeTruthy();
  expect(await screen.findByText('first page')).toBeTruthy();

  click(await screen.findByText('go to second'));

  expect(await screen.findByText('second page')).toBeTruthy();
  expect(await screen.findByText('navigate back')).toBeTruthy();

  click(await screen.findByText('navigate back'));

  expect(await screen.findByText('first page')).toBeTruthy();
});
