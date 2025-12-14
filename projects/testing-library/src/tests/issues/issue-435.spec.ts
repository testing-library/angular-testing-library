import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Component, inject, Injectable } from '@angular/core';
import { screen, render } from '../../public_api';
import { expect, test } from 'vitest';

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
  protected readonly demoService = inject(DemoService);
}

test('issue #435', async () => {
  await render(DemoComponent);

  const button = screen.getByRole('button', {
    name: /Click me/,
  });

  expect(button).toBeVisible();
});
