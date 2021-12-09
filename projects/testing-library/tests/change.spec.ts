import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { render, screen } from '../src/public_api';

@Component({
  selector: 'atl-fixture',
  template: ` {{ firstName }} {{ lastName }} `,
})
class FixtureComponent {
  @Input() firstName = 'Sarah';
  @Input() lastName?: string;
}

test('changes the component with updated props', async () => {
  const { change } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const firstName = 'Mark';
  change({ firstName });

  expect(screen.getByText(firstName)).toBeInTheDocument();
});

test('changes the component with updated props while keeping other props untouched', async () => {
  const firstName = 'Mark';
  const lastName = 'Peeters';
  const { change } = await render(FixtureComponent, {
    componentProperties: {
      firstName,
      lastName,
    },
  });

  expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();

  const firstName2 = 'Chris';
  change({ firstName: firstName2 });

  expect(screen.getByText(`${firstName2} ${lastName}`)).toBeInTheDocument();
});

@Component({
  selector: 'atl-fixture',
  template: ` {{ name }} `,
})
class FixtureWithNgOnChangesComponent implements OnChanges {
  @Input() name = 'Sarah';
  @Input() nameChanged?: (name: string, isFirstChange: boolean) => void;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.name && this.nameChanged) {
      this.nameChanged(changes.name.currentValue, changes.name.isFirstChange());
    }
  }
}

test('will call ngOnChanges on change', async () => {
  const nameChanged = jest.fn();
  const componentProperties = { nameChanged };
  const { change } = await render(FixtureWithNgOnChangesComponent, { componentProperties });
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const name = 'Mark';
  change({ name });

  expect(screen.getByText(name)).toBeInTheDocument();
  expect(nameChanged).toHaveBeenCalledWith(name, false);
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'atl-fixture',
  template: ` <div data-testid="number" [class.active]="activeField === 'number'">Number</div> `,
})
class FixtureWithOnPushComponent {
  @Input() activeField = '';
}

test('update properties on change', async () => {
  const { change } = await render(FixtureWithOnPushComponent);
  const numberHtmlElementRef = screen.queryByTestId('number');

  expect(numberHtmlElementRef).not.toHaveClass('active');
  change({ activeField: 'number' });
  expect(numberHtmlElementRef).toHaveClass('active');
});
