import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { screen } from '@testing-library/dom';
import { render } from '../src/public_api';

@Component({
  selector: 'fixture',
  template: ` {{ name }} `,
})
class FixtureComponent {
  @Input() name = 'Sarah';
}

test('will rerender the component with updated props', async () => {
  const component = await render(FixtureComponent);
  component.getByText('Sarah');

  const name = 'Mark';
  component.rerender({
    name,
  });

  component.getByText(name);
});

@Component({
  selector: 'fixture-onchanges',
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
  const component = await render(FixtureWithNgOnChangesComponent, { componentProperties });
  component.getByText('Sarah');

  const name = 'Mark';
  component.rerender({
    name,
  });

  component.getByText(name);
  expect(nameChanged).toBeCalledWith(name, false);
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'fixture-onpush',
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
