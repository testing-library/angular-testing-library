import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  template: `
    <a [routerLink]="'./detail/one'">Load one</a> | <a [routerLink]="'./detail/two'">Load two</a> |
    <a [routerLink]="'./detail/three'">Load three</a> |

    <hr />

    <router-outlet></router-outlet>
  `,
})
export class RootComponent {}

@Component({
  selector: 'app-detail',
  template: `
    <h2>Detail {{ id | async }}</h2>

    <p>{{ text | async }} {{ subtext | async }}</p>

    <a [routerLink]="'../..'">Back to parent</a>
    <a routerLink="/hidden-detail">hidden x</a>
  `,
})
export class DetailComponent {
  id = this.route.paramMap.pipe(map((params) => params.get('id')));
  text = this.route.queryParams.pipe(map((params) => params['text']));
  subtext = this.route.queryParams.pipe(map((params) => params['subtext']));
  constructor(private route: ActivatedRoute) {}
}

@Component({
  selector: 'app-detail-hidden',
  template: ' You found the treasure! ',
})
export class HiddenDetailComponent {}
