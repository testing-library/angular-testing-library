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

test('should strip the HTML from a string', async () => {
  await expect(() =>
    render(`<p data-testid="test"> {{ '${STRING_WITH_HTML}' | stripHTML }} </p>`, {
      declarations: [StripHTMLPipe],
    }),
  ).rejects.toThrow();
});

test('workaround should strip the HTML from a string', async () => {
  await render(`<p data-testid="test">{{ stringWithHtml | stripHTML }}</p>`, {
    componentProperties: {
      stringWithHtml: STRING_WITH_HTML,
    },
    declarations: [StripHTMLPipe],
  });

  const testControl = screen.getByTestId('test');
  expect(testControl).toHaveTextContent('Some database field with stripped HTML');
});
