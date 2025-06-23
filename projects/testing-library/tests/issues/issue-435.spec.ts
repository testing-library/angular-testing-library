import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Component, Inject, Injectable } from '@angular/core';
import { screen, render } from '../../src/public_api';

// Service
@Injectable()
class DemoService {
  buttonTitle = new BehaviorSubject<string>('Click me');
}

// Component
@Component({
  selector: 'atl-issue-435',
  standalone: true,
  imports: [CommonModule],
  providers: [DemoService],
  template: `
    <button>
      <!-- 👇 I only get the Inject error when I use the async pipe here -->
      {{ demoService.buttonTitle | async }}
    </button>
  `,
})
class DemoComponent {
  constructor(@Inject(DemoService) public demoService: DemoService) {}
}

test('issue #435', async () => {
  await render(DemoComponent);

  const button = screen.getByRole('button', {
    name: /Click me/,
  });

  expect(button).toBeVisible();
});
