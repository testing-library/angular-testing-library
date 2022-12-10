import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
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
  const { changeInput } = await render(FixtureComponent);
  expect(screen.getByText('Sarah')).toBeInTheDocument();

  const firstName = 'Mark';
  changeInput({ firstName });

  expect(screen.getByText(firstName)).toBeInTheDocument();
});

test('changes the component with updated props while keeping other props untouched', async () => {
  const firstName = 'Mark';
  const lastName = 'Peeters';
  const { changeInput } = await render(FixtureComponent, {
    componentInputs: {
      firstName,
      lastName,
    },
  });

  expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();

  const firstName2 = 'Chris';
  changeInput({ firstName: firstName2 });

  expect(screen.getByText(`${firstName2} ${lastName}`)).toBeInTheDocument();
});

@Component({
  selector: 'atl-fixture',
  template: ` {{ propOne }} {{ propTwo }}`,
})
class FixtureWithNgOnChangesComponent implements OnChanges {
  @Input() propOne = 'Init';
  @Input() propTwo = '';

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnChanges() {}
}

test('calls ngOnChanges on change', async () => {
  const componentInputs = { propOne: 'One', propTwo: 'Two' };
  const { changeInput, fixture } = await render(FixtureWithNgOnChangesComponent, { componentInputs });
  const spy = jest.spyOn(fixture.componentInstance, 'ngOnChanges');

  expect(screen.getByText(`${componentInputs.propOne} ${componentInputs.propTwo}`)).toBeInTheDocument();

  const propOne = 'UpdatedOne';
  const propTwo = 'UpdatedTwo';
  changeInput({ propOne, propTwo });

  expect(spy).toHaveBeenCalledTimes(1);
  expect(screen.getByText(`${propOne} ${propTwo}`)).toBeInTheDocument();
});

test('does not invoke ngOnChanges on change without props', async () => {
  const componentInputs = { propOne: 'One', propTwo: 'Two' };
  const { changeInput, fixture } = await render(FixtureWithNgOnChangesComponent, { componentInputs });
  const spy = jest.spyOn(fixture.componentInstance, 'ngOnChanges');

  expect(screen.getByText(`${componentInputs.propOne} ${componentInputs.propTwo}`)).toBeInTheDocument();

  changeInput({});
  expect(spy).not.toHaveBeenCalled();

  expect(screen.getByText(`${componentInputs.propOne} ${componentInputs.propTwo}`)).toBeInTheDocument();
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
  const { changeInput } = await render(FixtureWithOnPushComponent);
  const numberHtmlElementRef = screen.queryByTestId('number');

  expect(numberHtmlElementRef).not.toHaveClass('active');
  changeInput({ activeField: 'number' });
  expect(numberHtmlElementRef).toHaveClass('active');
});
