import { render, screen } from "@testing-library/angular";
import { StandaloneComponent } from "./19-standalone-component";

test('is possible to render a standalone component', async () => {
  await render(StandaloneComponent);

  const content = screen.getByTestId('standalone');

  expect(content).toHaveTextContent("Standalone Component")
});
