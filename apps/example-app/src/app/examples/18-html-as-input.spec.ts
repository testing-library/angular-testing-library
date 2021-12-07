import { render, screen } from '@testing-library/angular';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHTML',
})
class StripHTMLPipe implements PipeTransform {
  transform(stringValueWithHTML: string): string {
    return stringValueWithHTML.replace(/<[^>]*>?/gm, '');
  }
}

const STRING_WITH_HTML =
  'Some <em>database</em> <b>field</b> <div><span>with <strong>stripped</strong> HTML</span></div>';

// https://github.com/testing-library/angular-testing-library/pull/271
test('passes HTML as component properties', async () => {
  await render(`<p>{{ stringWithHtml | stripHTML }}</p>`, {
    componentProperties: {
      stringWithHtml: STRING_WITH_HTML,
    },
    declarations: [StripHTMLPipe],
  });

  expect(screen.getByText('Some database field with stripped HTML')).toBeInTheDocument();
});


test('throws when passed HTML is passed in directly', async () => {
  await expect(() =>
    render(`<p data-testid="test"> {{ '${STRING_WITH_HTML}' | stripHTML }} </p>`, {
      declarations: [StripHTMLPipe],
    }),
  ).rejects.toThrow();
});

