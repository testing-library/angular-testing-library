import { render, screen, fireEvent } from '@testing-library/angular';

import { SpoilerDirective } from './08-directive';

test('it is possible to test directives', async () => {
  await render('<div appSpoiler data-testid="dir"></div>', {
    declarations: [SpoilerDirective],
  });

  const directive = screen.getByTestId('dir');

  expect(screen.queryByText('I am visible now...')).not.toBeInTheDocument();
  expect(screen.queryByText('SPOILER')).toBeInTheDocument();

  fireEvent.mouseOver(directive);
  expect(screen.queryByText('SPOILER')).not.toBeInTheDocument();
  expect(screen.queryByText('I am visible now...')).toBeInTheDocument();

  fireEvent.mouseLeave(directive);
  expect(screen.queryByText('SPOILER')).toBeInTheDocument();
  expect(screen.queryByText('I am visible now...')).not.toBeInTheDocument();
});

test('it is possible to test directives with props', async () => {
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  await render('<div appSpoiler [hidden]="hidden" [visible]="visible"></div>', {
    declarations: [SpoilerDirective],
    componentProperties: {
      hidden,
      visible,
    },
  });

  expect(screen.queryByText(visible)).not.toBeInTheDocument();
  expect(screen.queryByText(hidden)).toBeInTheDocument();

  fireEvent.mouseOver(screen.queryByText(hidden));
  expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  expect(screen.queryByText(visible)).toBeInTheDocument();

  fireEvent.mouseLeave(screen.queryByText(visible));
  expect(screen.queryByText(hidden)).toBeInTheDocument();
  expect(screen.queryByText(visible)).not.toBeInTheDocument();
});

test('it is possible to test directives with props in template', async () => {
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  await render(`<div appSpoiler hidden="${hidden}" visible="${visible}"></div>`, {
    declarations: [SpoilerDirective],
  });

  expect(screen.queryByText(visible)).not.toBeInTheDocument();
  expect(screen.queryByText(hidden)).toBeInTheDocument();

  fireEvent.mouseOver(screen.queryByText(hidden));
  expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  expect(screen.queryByText(visible)).toBeInTheDocument();

  fireEvent.mouseLeave(screen.queryByText(visible));
  expect(screen.queryByText(hidden)).toBeInTheDocument();
  expect(screen.queryByText(visible)).not.toBeInTheDocument();
});
