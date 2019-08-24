import { FireFunction, FireObject } from '@testing-library/dom';

function wait(time) {
  return new Promise(function(resolve) {
    setTimeout(() => resolve(), time);
  });
}

// implementation from https://github.com/testing-library/user-event
export function createType(fireEvent: FireFunction & FireObject) {
  function createFireChangeEvent(value: string) {
    return function fireChangeEvent(event) {
      if (value !== event.target.value) {
        fireEvent.change(event.target);
      }
      event.target.removeEventListener('blur', fireChangeEvent);
    };
  }

  return async function type(element: HTMLElement, value: string, { allAtOnce = false, delay = 0 } = {}) {
    const initialValue = (element as HTMLInputElement).value;

    if (allAtOnce) {
      fireEvent.input(element, { target: { value } });
      element.addEventListener('blur', createFireChangeEvent(initialValue));
      return;
    }

    let actuallyTyped = '';
    for (let index = 0; index < value.length; index++) {
      const char = value[index];
      const key = char;
      const keyCode = char.charCodeAt(0);

      if (delay > 0) {
        await wait(delay);
      }

      const downEvent = fireEvent.keyDown(element, {
        key: key,
        keyCode: keyCode,
        which: keyCode,
      });

      if (downEvent) {
        const pressEvent = fireEvent.keyPress(element, {
          key: key,
          keyCode,
          charCode: keyCode,
        });

        if (pressEvent) {
          actuallyTyped += key;
          fireEvent.input(element, {
            target: {
              value: actuallyTyped,
            },
            bubbles: true,
            cancelable: true,
          });
        }
      }

      fireEvent.keyUp(element, {
        key: key,
        keyCode: keyCode,
        which: keyCode,
      });
    }

    element.addEventListener('blur', createFireChangeEvent(initialValue));
  };
}
