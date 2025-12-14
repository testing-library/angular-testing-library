import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  selector: 'atl-main',
  template: `
    <a routerLink="./detail/one">Load one</a> | <a routerLink="./detail/two">Load two</a> |
    <a routerLink="./detail/three">Load three</a> |

    <hr />

    <router-outlet />
  `,
})
export class RootComponent {}

@Component({
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  selector: 'atl-detail',
  template: `
    <h2>Detail {{ id | async }}</h2>

    <p>{{ text | async }} {{ subtext | async }}</p>

    <a routerLink="../..">Back to parent</a>
    <a routerLink="/hidden-detail">hidden x</a>
  `,
})
export class DetailComponent {
  private route = inject(ActivatedRoute);
  id = this.route.paramMap.pipe(map((params) => params.get('id')));
  text = this.route.queryParams.pipe(map((params) => params['text']));
  subtext = this.route.queryParams.pipe(map((params) => params['subtext']));
}

@Component({
  standalone: true,
  selector: 'atl-detail-hidden',
  template: ' You found the treasure! ',
})
export class HiddenDetailComponent {}
