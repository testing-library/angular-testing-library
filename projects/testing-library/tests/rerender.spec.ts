import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { render, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: ` {{ name }} `,
})
class FixtureComponent {
  @Input() name = 'Sarah';
}

test('will rerender the component with updated props', async () => {
  const { rerender } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const name = 'Mark';
  rerender({ name });

  expect(screen.getByText(name)).toBeInTheDocument();
});

@Component({
  selector: 'atl-fixture',
  template: ` {{ name }} `,
})
class FixtureWithNgOnChangesComponent implements OnChanges {
  @Input() name = 'Sarah';
  @Input() nameChanged: (name: string, isFirstChange: boolean) => void;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.name && this.nameChanged) {
      this.nameChanged(changes.name.currentValue, changes.name.isFirstChange());
    }
  }
}

test('will call ngOnChanges on rerender', async () => {
  const nameChanged = jest.fn();
  const componentProperties = { nameChanged };
  const { rerender } = await render(FixtureWithNgOnChangesComponent, { componentProperties });
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const name = 'Mark';
  rerender({ name });

  expect(screen.getByText(name)).toBeInTheDocument();
  expect(nameChanged).toHaveBeenCalledWith(name, false);
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'atl-fixture',
  template: ` <div data-testid="number" [class.active]="activeField === 'number'">Number</div> `,
})
class FixtureWithOnPushComponent {
  @Input() activeField: string;
}

test('update properties on rerender', async () => {
  const { rerender } = await render(FixtureWithOnPushComponent);
  const numberHtmlElementRef = screen.queryByTestId('number');

  expect(numberHtmlElementRef).not.toHaveClass('active');
  rerender({ activeField: 'number' });
  expect(numberHtmlElementRef).toHaveClass('active');
});
