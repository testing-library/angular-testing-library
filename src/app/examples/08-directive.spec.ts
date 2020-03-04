import { render, screen } from '@testing-library/angular';

import { SpoilerDirective } from './08-directive';

test('it is possible to test directives', async () => {
  const { mouseOver, mouseLeave, debugElement } = await render(SpoilerDirective, {
    template: `<div appSpoiler></div>`,
  });

  expect(screen.queryByText('I am visible now...')).not.toBeInTheDocument();
  expect(screen.queryByText('SPOILER')).toBeInTheDocument();

  mouseOver(debugElement.nativeElement);
  expect(screen.queryByText('SPOILER')).not.toBeInTheDocument();
  expect(screen.queryByText('I am visible now...')).toBeInTheDocument();

  mouseLeave(debugElement.nativeElement);
  expect(screen.queryByText('SPOILER')).toBeInTheDocument();
  expect(screen.queryByText('I am visible now...')).not.toBeInTheDocument();
});

test('it is possible to test directives with props', async () => {
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  const { mouseOver, mouseLeave } = await render(SpoilerDirective, {
    template: `<div appSpoiler [hidden]="hidden" [visible]="visible"></div>`,
    componentProperties: {
      hidden,
      visible,
    },
  });

  expect(screen.queryByText(visible)).not.toBeInTheDocument();
  expect(screen.queryByText(hidden)).toBeInTheDocument();

  mouseOver(screen.queryByText(hidden));
  expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  expect(screen.queryByText(visible)).toBeInTheDocument();

  mouseLeave(screen.queryByText(visible));
  expect(screen.queryByText(hidden)).toBeInTheDocument();
  expect(screen.queryByText(visible)).not.toBeInTheDocument();
});

test('it is possible to test directives with props in template', async () => {
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  const { mouseLeave, mouseOver } = await render(SpoilerDirective, {
    template: `<div appSpoiler hidden="${hidden}" visible="${visible}"></div>`,
  });

  expect(screen.queryByText(visible)).not.toBeInTheDocument();
  expect(screen.queryByText(hidden)).toBeInTheDocument();

  mouseOver(screen.queryByText(hidden));
  expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  expect(screen.queryByText(visible)).toBeInTheDocument();

  mouseLeave(screen.queryByText(visible));
  expect(screen.queryByText(hidden)).toBeInTheDocument();
  expect(screen.queryByText(visible)).not.toBeInTheDocument();
});
