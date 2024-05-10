import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from '@inquirer/testing';
import spinners from 'cli-spinners';
import { type SelectProps, Separator, select } from '../src/index';
import { createRemoteData, top100Films } from './data';

type RenderResult = Awaited<ReturnType<typeof render>>;
type RenderEvents = RenderResult['events'];
type RenderGetScreen = RenderResult['getScreen'];
type RenderAnswer = RenderResult['answer'];

const wait = (wait: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, wait);
  });

const quickRemoteData = createRemoteData(10, 30);

describe('inquirer-select-pro', () => {
  const message = 'Choose movie:';
  let events!: RenderEvents;
  let answer!: RenderAnswer;
  let getScreen!: RenderGetScreen;
  async function renderPrompt<Value, Multiple extends boolean>(
    config: SelectProps<Value, Multiple>,
  ) {
    const result = await render(select as any, config);
    events = result.events;
    getScreen = result.getScreen;
    answer = result.answer;
    return result;
  }

  afterEach(() => {
    // @ts-ignore
    getScreen = null;
    // @ts-ignore
    events = null;
    answer.catch(() => {
      // ignore
    });
    answer.cancel();
    // @ts-ignore
    answer = null;
  });

  function keyseq(key: string, repeat: number) {
    if (!events) return;
    for (let index = 0; index < repeat; index++) {
      events.keypress(key);
    }
  }
  function isLoading() {
    return spinners.dots.frames.includes(getScreen()[0]);
  }

  const waitForInteraction = () => vi.waitUntil(() => getScreen()[0] === '?');

  describe('interactions', () => {
    // common interactions
    async function interactInMutipleMode(
      options: {
        backspace?: number;
        afterFilter?: () => Promise<any>;
        afterRemoveOption?: () => Promise<any>;
      } = {},
    ) {
      // select
      events.keypress('tab');
      expect(getScreen()).toMatchSnapshot();
      // setCursor
      keyseq('down', 4);
      expect(getScreen()).toMatchSnapshot();
      // filter
      events.type('god');
      expect(getScreen()).toMatchSnapshot();
      await options.afterFilter?.();
      // select after filter
      events.keypress('tab');
      events.keypress('down');
      expect(getScreen()).toMatchSnapshot();
      events.keypress('tab');
      // deselect
      events.keypress('tab');
      expect(getScreen()).toMatchSnapshot();
      // remove option
      keyseq('backspace', options.backspace ?? 1);
      expect(getScreen()).toMatchSnapshot();
      await options.afterRemoveOption?.();
      // submit
      events.keypress('enter');
    }
    it('should work when options is a normal array', async () => {
      await renderPrompt({
        message,
        options: top100Films,
        pageSize: 3,
      });
      expect(getScreen()).toMatchSnapshot();
      await interactInMutipleMode();
      await expect(answer).resolves.toMatchInlineSnapshot(`
        [
          "The Shawshank Redemption",
        ]
      `);
      expect(getScreen()).toMatchInlineSnapshot(
        `"? Choose movie: The Shawshank Redemption (1994)"`,
      );
    });

    it('should work when options is an async function', async () => {
      const options = vi.fn(createRemoteData(100, 300));
      await renderPrompt({
        message,
        options,
        pageSize: 4,
        inputDelay: 50,
      });
      expect(isLoading()).toBe(true);
      await waitForInteraction();
      expect(getScreen()).toMatchSnapshot();
      expect(options).toHaveBeenCalledOnce();
      await interactInMutipleMode({
        backspace: 3,
        afterFilter: async () => {
          // debounce delay
          await wait(50);
          expect(options).toHaveBeenCalledTimes(2);
          // shoud be loading
          expect(isLoading()).toBe(true);
          await waitForInteraction();
          expect(getScreen()).toMatchSnapshot();
        },
      });
      await expect(answer).resolves.toMatchInlineSnapshot(`
        [
          "The Shawshank Redemption",
          "Goodfellas",
        ]
      `);
      expect(getScreen()).toMatchInlineSnapshot(
        `"? Choose movie: The Shawshank Redemption (1994), Goodfellas (1990)"`,
      );
    });
    it('should work when options is a function and filter disabled', async () => {
      await renderPrompt({
        message,
        options: () => top100Films,
        pageSize: 4,
        filter: false,
      });
      await waitForInteraction();
      expect(getScreen()).toMatchSnapshot();
    });

    it('should clear input after the option is selected (clearInputWhenSelected=true)', async () => {
      await renderPrompt({
        message,
        options: quickRemoteData,
        pageSize: 2,
        inputDelay: 10,
        clearInputWhenSelected: true,
      });
      await waitForInteraction();
      events.type('god');
      await wait(10);
      await waitForInteraction();
      events.keypress('tab');
      expect(getScreen()).toMatchSnapshot();
    });

    it('should get the result when press <enter> in radio selection mode', async () => {
      await renderPrompt({
        message,
        options: top100Films,
        multiple: false,
        pageSize: 3,
      });
      events.keypress('enter');
      await expect(answer).resolves.toMatchInlineSnapshot(
        `"The Shawshank Redemption"`,
      );
      expect(getScreen()).toMatchInlineSnapshot(
        `"? Choose movie: The Shawshank Redemption (1994)"`,
      );
    });

    it('should be possible to filter in radio selection mode', async () => {
      await renderPrompt({
        message,
        options: quickRemoteData,
        multiple: false,
        pageSize: 3,
        inputDelay: 20,
      });
      expect(isLoading()).toBe(true);
      await waitForInteraction();
      expect(getScreen()).toMatchSnapshot();
      events.type('god');
      await wait(20);
      expect(isLoading()).toBe(true);
      await waitForInteraction();
      events.keypress('down');
      events.keypress('enter');
      expect(await answer).toMatchInlineSnapshot(`"The Godfather"`);
      expect(getScreen()).toMatchInlineSnapshot(
        `"? Choose movie: The Godfather (1972)"`,
      );
    });

    it('should select the current option by <enter> when display filtered results', async () => {
      await renderPrompt({
        message,
        options: quickRemoteData,
        pageSize: 4,
        inputDelay: 20,
      });
      await waitForInteraction();
      events.type('god');
      await wait(20);
      await waitForInteraction();
      expect(getScreen()).toMatchSnapshot();
      events.keypress('enter');
      events.keypress('enter');
      expect(await answer).toMatchInlineSnapshot(`
        [
          "Goodfellas",
        ]
      `);
    });

    it('should disable interactions when select is loading', async () => {
      await renderPrompt({
        message,
        options: createRemoteData(200, 300),
        pageSize: 4,
        inputDelay: 20,
      });
      const origin = getScreen();
      events.keypress('enter');
      await wait(10);
      events.keypress('tab');
      await wait(10);
      events.type(' r a n d o m');
      await wait(10);
      events.keypress('enter');
      expect(getScreen()).toBe(origin);
      await wait(300);
    });

    it('will keep it the same as before when the search results are empty and then press <enter>', async () => {
      await renderPrompt({
        message,
        options: quickRemoteData,
        pageSize: 4,
        inputDelay: 20,
      });
      await waitForInteraction();
      events.type('any keys');
      await wait(20);
      await waitForInteraction();
      events.keypress('enter');
      const origin = getScreen();
      events.keypress('enter');
      expect(getScreen()).toBe(origin);
    });
  });

  describe('appearance', () => {
    const options = [
      { name: 'a', value: 1 },
      { name: 'b', value: 2, disabled: true },
      { name: 'c', value: 3 },
      { name: 'd', value: 4, disabled: '(stale)' },
    ];

    it('should display disabled options', async () => {
      await renderPrompt({
        message: 'select',
        options,
        pageSize: 2,
      });
      events.keypress('tab');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? select a
        >[✔] a
        -[x] b (disabled)"
      `);
      events.keypress('down');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? select a
        -[x] b (disabled)
        >[ ] c"
      `);
    });

    it('should display options in a loop', async () => {
      await renderPrompt({
        message: 'select',
        options,
        pageSize: 3,
        loop: true,
      });
      events.keypress('tab');
      keyseq('down', 2);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? select a
        -[x] d (stale)
        >[✔] a
        -[x] b (disabled)"
      `);
      keyseq('up', 1);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? select a
        -[x] b (disabled)
        >[ ] c
        -[x] d (stale)"
      `);
    });

    it('should display seperator', async () => {
      await renderPrompt({
        message: 'select',
        options: [new Separator(), ...options, new Separator()],
        pageSize: 4,
        loop: true,
      });
      events.keypress('tab');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? select a
         ──────────────
        >[✔] a
        -[x] b (disabled)
         [ ] c"
      `);
      keyseq('down', 2);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? select a
         ──────────────
         ──────────────
        >[✔] a
        -[x] b (disabled)"
      `);
    });

    it('should display empty text when options is an empty array', async () => {
      await renderPrompt({
        message: 'select',
        options: [],
        pageSize: 3,
        instructions: false,
        multiple: false,
      });
      expect(getScreen().includes('No results.')).toBe(true);
    });

    it('should display empty text when filter result is empty', async () => {
      const emptyText = 'No records.';
      await renderPrompt({
        message,
        options: quickRemoteData,
        pageSize: 4,
        emptyText,
        inputDelay: 10,
      });
      expect(isLoading()).toBe(true);
      await waitForInteraction();
      events.type('any keys i want');
      await wait(10);
      await waitForInteraction();
      expect(getScreen().includes(emptyText)).toBe(true);
    });

    it('should display custom instructions', async () => {
      await renderPrompt({
        message,
        options,
        pageSize: 2,
        instructions: (context) =>
          context.multiple ? 'multiple mode' : 'radio mode',
      });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Choose movie:multiple mode 
        >[ ] a
        -[x] b (disabled)
        (Use arrow keys to reveal more options)"
      `);
    });

    it('should hide instructions', async () => {
      await renderPrompt({
        message,
        options,
        pageSize: 2,
        instructions: false,
      });
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Choose movie: 
        >[ ] a
        -[x] b (disabled)"
      `);
    });
  });

  describe('data model', () => {
    it('should display default options correctly', async () => {
      await renderPrompt({
        message,
        options: createRemoteData(10, 20, 10),
        defaultValue: ['Modern Times'],
        pageSize: 3,
        inputDelay: 10,
        instructions: false,
      });
      await waitForInteraction();
      expect(getScreen()).toMatchSnapshot();
      events.type('mo');
      await wait(10);
      await waitForInteraction();
      expect(getScreen()).toMatchSnapshot();
    });

    const optionsForDisplayValue = {
      message,
      options: (input: any) => {
        if (!input)
          return [{ value: 'a' }, { value: 1, name: 'One' }, { value: {} }];
        if (input.includes('c')) {
          return [{ name: 'C', value: 'c' }];
        }
      },
      pageSize: 3,
      equals: (a: any, b: any) => {
        if (typeof a === 'object' && typeof b === 'object') {
          return Object.keys(a).length === Object.keys(b).length;
        }
        return a === b;
      },
      instructions: false,
      inputDelay: 10,
    };

    it('should display value instead of name which does not exist', async () => {
      // @ts-ignore
      await renderPrompt({
        ...optionsForDisplayValue,
        defaultValue: ['c', {}, 12n, 1, 2, true],
      });
      await waitForInteraction();
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Choose movie:
        >> c, [object Object], 12, One, 2, true
        >[ ] a
         [✔] One
         [✔] [object Object]"
      `);
      events.keypress('tab');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Choose movie:
        >> c, [object Object], 12, One, 2, true, a
        >[✔] a
         [✔] One
         [✔] [object Object]"
      `);
      events.type('c');
      await wait(10);
      await waitForInteraction();
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Choose movie:
        >> C, [object Object], 12, One, 2, true, a c
        >[✔] C"
      `);
    });

    it('should display value in radio mode ', async () => {
      // @ts-ignore
      await renderPrompt({
        ...optionsForDisplayValue,
        defaultValue: 'a',
        multiple: false,
      });
      await waitForInteraction();
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Choose movie:
        >> a
        > a
          One
          [object Object]"
      `);
    });

    it('should throw error when `defaultValue` is non-array in multiple selection mode', async () => {
      await renderPrompt({
        message,
        options: quickRemoteData,
        defaultValue: 'invalid',
      });
      await expect(answer).rejects.toThrowError(
        /please pass the array as the default value/,
      );
    });

    it('should use `equals` function when the option value is non-primitive', async () => {
      const options = [
        { name: 'point 1', value: { x: 0, y: 0 } },
        { name: 'point 2', value: { x: 1, y: 1 } },
        { name: 'point 3', value: { x: 10, y: 20 } },
        { name: 'point 4', value: { x: 30, y: 40 } },
        { name: 'point 5', value: { x: 50, y: 60 } },
        { name: 'point 6', value: { x: 70, y: 80 } },
        { name: 'point 7', value: { x: 90, y: 100 } },
        { name: 'point 8', value: { x: 1000, y: 2000 } },
        { name: 'point 9', value: { x: 3000, y: 4000 } },
        { name: 'point 10', value: { x: 5000, y: 6000 } },
      ];
      await renderPrompt({
        message: 'choose point',
        options: (input) => {
          if (!input) return options;
          return options.filter(({ name }) => name.includes(input));
        },
        equals: (a, b) => {
          return a.x === b.x && a.y === b.y;
        },
        pageSize: 4,
        inputDelay: 10,
        instructions: false,
      });
      await waitForInteraction();
      events.type('1');
      await wait(10);
      await waitForInteraction();
      // filter
      expect(getScreen()).toMatchInlineSnapshot(`
        "? choose point
        >>  1
        >[ ] point 1
         [ ] point 10"
      `);
      // select/deselect
      events.keypress('tab');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? choose point
        >> point 1 1
        >[✔] point 1
         [ ] point 10"
      `);
      events.keypress('tab');
      expect(getScreen()).toMatchInlineSnapshot(`
        "? choose point
        >>  1
        >[ ] point 1
         [ ] point 10"
      `);
      events.keypress('tab');
      keyseq('backspace', 10);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? choose point
        >> Type to search
        >[ ] point 1
         [ ] point 10"
      `);
    });

    it('should validate when required=true', async () => {
      await renderPrompt({
        message,
        options: top100Films,
        pageSize: 2,
        required: true,
        instructions: false,
      });
      await waitForInteraction();
      events.keypress('enter');
      await wait(10);
      expect(getScreen()).toMatchInlineSnapshot(`
        "? Choose movie: 
        >[ ] The Shawshank Redemption (1994)
         [ ] The Godfather (1972)
        > At least one option must be selected"
      `);
    });

    function validationTest(error: string | boolean) {
      it(`should execute validate function when error is \`${error}\``, async () => {
        await renderPrompt({
          message,
          options: top100Films,
          pageSize: 2,
          validate: (ops) => {
            const hasShawshank = ops.some(
              (op) => op.value === 'The Shawshank Redemption',
            );
            return hasShawshank ? error : true;
          },
          instructions: false,
        });
        events.keypress('tab');
        events.keypress('enter');
        await wait(10);
        expect(
          getScreen().includes(
            typeof error === 'boolean'
              ? 'You must select a valid value'
              : error,
          ),
        ).toBe(true);
      });
    }

    validationTest('I dont like "The Shawshank Redemption"');
    validationTest(false);
  });
});
