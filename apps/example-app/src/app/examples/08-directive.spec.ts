import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { SpoilerDirective } from './08-directive';

test('it is possible to test directives', async () => {
  const user = userEvent.setup();

  await render('<div appSpoiler data-testid="dir"></div>', {
    imports: [SpoilerDirective],
  });

  const directive = screen.getByTestId('dir');

  expect(screen.queryByText('I am visible now...')).not.toBeInTheDocument();
  expect(screen.getByText('SPOILER')).toBeInTheDocument();

  await user.hover(directive);
  expect(screen.queryByText('SPOILER')).not.toBeInTheDocument();
  expect(screen.getByText('I am visible now...')).toBeInTheDocument();

  await user.unhover(directive);
  expect(screen.getByText('SPOILER')).toBeInTheDocument();
  expect(screen.queryByText('I am visible now...')).not.toBeInTheDocument();
});

test('it is possible to test directives with props', async () => {
  const user = userEvent.setup();
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  await render('<div appSpoiler [hidden]="hidden" [visible]="visible"></div>', {
    imports: [SpoilerDirective],
    componentProperties: {
      hidden,
      visible,
    },
  });

  expect(screen.queryByText(visible)).not.toBeInTheDocument();
  expect(screen.getByText(hidden)).toBeInTheDocument();

  await user.hover(screen.getByText(hidden));
  expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  expect(screen.getByText(visible)).toBeInTheDocument();

  await user.unhover(screen.getByText(visible));
  expect(screen.getByText(hidden)).toBeInTheDocument();
  expect(screen.queryByText(visible)).not.toBeInTheDocument();
});

test('it is possible to test directives with props in template', async () => {
  const user = userEvent.setup();
  const hidden = 'SPOILER ALERT';
  const visible = 'There is nothing to see here ...';

  await render(`<div appSpoiler hidden="${hidden}" visible="${visible}"></div>`, {
    imports: [SpoilerDirective],
  });

  expect(screen.queryByText(visible)).not.toBeInTheDocument();
  expect(screen.getByText(hidden)).toBeInTheDocument();

  await user.hover(screen.getByText(hidden));
  expect(screen.queryByText(hidden)).not.toBeInTheDocument();
  expect(screen.getByText(visible)).toBeInTheDocument();

  await user.unhover(screen.getByText(visible));
  expect(screen.getByText(hidden)).toBeInTheDocument();
  expect(screen.queryByText(visible)).not.toBeInTheDocument();
});
