import { render } from '@testing-library/angular';

import { SpoilerDirective } from './08-directive';

test('it is possible to test directives', async () => {
  const component = await render(SpoilerDirective, {
    template: `<div appSpoiler></div>`,
  });

  expect(component.queryByText('I am visible now...')).not.toBeInTheDocument();
  expect(component.queryByText('SPOILER')).toBeInTheDocument();

  component.mouseOver(component.debugElement.nativeElement);
  expect(component.queryByText('SPOILER')).not.toBeInTheDocument();
  expect(component.queryByText('I am visible now...')).toBeInTheDocument();

  component.mouseLeave(component.debugElement.nativeElement);
  expect(component.queryByText('SPOILER')).toBeInTheDocument();
  expect(component.queryByText('I am visible now...')).not.toBeInTheDocument();
});

test('it is possible to test directives with props', async () => {
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  const component = await render(SpoilerDirective, {
    template: `<div appSpoiler [hidden]="hidden" [visible]="visible"></div>`,
    componentProperties: {
      hidden,
      visible,
    },
  });

  expect(component.queryByText(visible)).not.toBeInTheDocument();
  expect(component.queryByText(hidden)).toBeInTheDocument();

  component.mouseOver(component.queryByText(hidden));
  expect(component.queryByText(hidden)).not.toBeInTheDocument();
  expect(component.queryByText(visible)).toBeInTheDocument();

  component.mouseLeave(component.queryByText(visible));
  expect(component.queryByText(hidden)).toBeInTheDocument();
  expect(component.queryByText(visible)).not.toBeInTheDocument();
});

test('it is possible to test directives with props in template', async () => {
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  const component = await render(SpoilerDirective, {
    template: `<div appSpoiler hidden="${hidden}" visible="${visible}"></div>`,
  });

  expect(component.queryByText(visible)).not.toBeInTheDocument();
  expect(component.queryByText(hidden)).toBeInTheDocument();

  component.mouseOver(component.queryByText(hidden));
  expect(component.queryByText(hidden)).not.toBeInTheDocument();
  expect(component.queryByText(visible)).toBeInTheDocument();

  component.mouseLeave(component.queryByText(visible));
  expect(component.queryByText(hidden)).toBeInTheDocument();
  expect(component.queryByText(visible)).not.toBeInTheDocument();
});
