import {Component, NgModule} from '@angular/core';
import { render, screen } from '../../src/public_api';
import {Router, RouterModule, Routes} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {click} from "@testing-library/user-event/dist/click";
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
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
class AppRoutingModule {}


test('navigate', async () => {
  // await render(MainComponent, {imports: [AppRoutingModule, RouterTestingModule]});
  const subject = await render(MainComponent, {imports: [AppRoutingModule, RouterTestingModule]});
  await subject.navigate('/');

  const router = TestBed.inject(Router);
  router.initialNavigation();

  await expect(screen.findByText('Navigate')).toBeTruthy();
  await expect(screen.findByText('first page')).toBeTruthy();

  click(await screen.findByText('go to second'));

  await expect(screen.findByText('second page')).toBeTruthy();
  await expect(screen.findByText('navigate back')).toBeTruthy();

  click(await screen.findByText('navigate back', {selector: 'button'}));

  // await expect(screen.findByText('first page')).toBeTruthy();
});
