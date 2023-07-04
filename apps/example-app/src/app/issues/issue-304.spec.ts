import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';

// with goBackSpy, the implementation of goBack won't be invoked (because it's using the spy)
test('should call a goBack when user click in the button', async () => {
  const user = userEvent.setup();

  const goBackSpy = jest.fn();
  await render(HeaderBackButtonComponent, {
    declarations: [IconButtonComponent],
    componentProperties: {
      goBack: goBackSpy,
    },
  });

  const button = screen.getByLabelText(/icon button/i);
  await user.click(button);
  expect(goBackSpy).toHaveBeenCalled();
});

// don't spy on goBack, this way the implementation of goBack is invoked, and you can test if location.back() is called
test('should call a Location.back when user click in the button', async () => {
  const user = userEvent.setup();

  await render(HeaderBackButtonComponent, {
    declarations: [IconButtonComponent],
  });

  const location = TestBed.inject(Location);
  jest.spyOn(location, 'back');

  const button = screen.getByLabelText(/icon button/i);
  await user.click(button);
  expect(location.back).toHaveBeenCalled();
});

@Component({
  selector: 'app-cebs-header-back-button',
  template: `
    <header>
      <app-cebs-icon-button icon="chevron_left" aria-label="back button" (clickEvent)="goBack()"></app-cebs-icon-button>
    </header>
  `,
})
class HeaderBackButtonComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

@Component({
  selector: 'app-cebs-icon-button',
  template: `
    <button (click)="onClick()" aria-label="icon button">
      <span class="material-symbols-outlined icon">{{ icon }}</span>
    </button>
  `,
})
class IconButtonComponent {
  @Output() clickEvent = new EventEmitter();
  @Input() icon!: string;

  onClick(): void {
    this.clickEvent.emit();
  }
}
