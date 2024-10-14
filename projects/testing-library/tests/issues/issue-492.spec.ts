import { AsyncPipe } from '@angular/common';
import { Component, inject, Injectable } from '@angular/core';
import { render, screen, waitFor } from '../../src/public_api';
import { Observable, BehaviorSubject, map } from 'rxjs';

test('displays username', async () => {
  // stubbed user service using a Subject
  const user = new BehaviorSubject({ name: 'username 1' });
  const userServiceStub: Partial<UserService> = {
    getName: () => user.asObservable().pipe(map((u) => u.name)),
  };

  // render the component with injection of the stubbed service
  await render(UserComponent, {
    componentProviders: [
      {
        provide: UserService,
        useValue: userServiceStub,
      },
    ],
  });

  // assert first username emitted is rendered
  expect(await screen.findByRole('heading')).toHaveTextContent('username 1');

  // emitting a second username
  user.next({ name: 'username 2' });

  // assert the second username is rendered
  await waitFor(() => expect(screen.getByRole('heading')).toHaveTextContent('username 2'));
});

@Component({
  selector: 'atl-user',
  standalone: true,
  template: `<h1>{{ username$ | async }}</h1>`,
  imports: [AsyncPipe],
})
class UserComponent {
  readonly username$: Observable<string> = inject(UserService).getName();
}

@Injectable()
class UserService {
  getName(): Observable<string> {
    throw new Error('Not implemented');
  }
}
