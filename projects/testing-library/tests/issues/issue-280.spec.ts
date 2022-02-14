import {Component, NgModule} from '@angular/core';
import {render, screen} from '@testing-library/angular';
import {Router, RouterModule, Routes} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import userEvent from "@testing-library/user-event";
import {Location} from "@angular/common";
import {TestBed} from "@angular/core/testing";

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


// test('navigate to second page and back', async () => {
//   const subject = await render(MainComponent, {imports: [AppRoutingModule, RouterTestingModule]});
//   await subject.navigate('/');
//
//   expect(await screen.findByText('Navigate')).toBeInTheDocument();
//   expect(await screen.findByText('first page')).toBeInTheDocument();
//
//   userEvent.click(await screen.findByText('go to second'));
//
//   expect(await screen.findByText('second page')).toBeInTheDocument();
//   expect(await screen.findByText('navigate back')).toBeInTheDocument();
//
//   userEvent.click(await screen.findByText('navigate back'));
//
//   expect(await screen.findByText('first page')).toBeInTheDocument();
// });

test('navigate to second page and back', async () => {
  const subject = await render(MainComponent, {imports: [AppRoutingModule, RouterTestingModule]});

  TestBed.inject(Router).initialNavigation();

  await subject.navigate('/');

  expect(await screen.findByText('Navigate')).toBeInTheDocument();
  expect(await screen.findByText('first page')).toBeInTheDocument();

  userEvent.click(await screen.findByText('go to second'));

  expect(await screen.findByText('second page')).toBeInTheDocument();
  expect(await screen.findByText('navigate back')).toBeInTheDocument();

  userEvent.click(await screen.findByText('navigate back'));

  expect(await screen.findByText('first page')).toBeInTheDocument();
});
