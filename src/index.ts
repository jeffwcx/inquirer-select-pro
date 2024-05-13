import {
  Separator,
  createPrompt,
  makeTheme,
  useMemo,
  usePagination,
  usePrefix,
} from '@inquirer/core';
import chalk from 'chalk';
import figures from '@inquirer/figures';
import ansiEscapes from 'ansi-escapes';
import { useSelect } from './useSelect';
import {
  type InternalSelectItem,
  type SelectContext,
  type SelectProps,
  SelectStatus,
  type SelectTheme,
  type SelectValue,
} from './types';

/**
 * default theme
 */
const defaultSelectTheme: (multiple: boolean) => SelectTheme = (multiple) => ({
  icon: {
    checked: multiple ? `[${chalk.green(figures.tick)}]` : '',
    unchecked: multiple ? '[ ]' : '',
    cursor: '>',
    inputCursor: chalk.cyan('>>'),
  },
  style: {
    disabledOption: (text: string) => chalk.dim(`-[x] ${text}`),
    renderSelectedOptions: (selectedOptions) =>
      selectedOptions.map((option) => option.name || option.value).join(', '),
    emptyText: (text) => `${chalk.blue(figures.info)} ${chalk.bold(text)}`,
    placeholder: (text: string) => chalk.dim(text),
  },
  helpMode: 'auto',
});

function renderPage<Value>({
  theme,
  cursor,
  displayItems,
  pageSize,
  loop,
  status,
  emptyText,
}: SelectContext<Value>) {
  if (displayItems.length <= 0) {
    if (status === SelectStatus.UNLOADED) {
      return '';
    }
    return theme.style.emptyText(emptyText);
  }
  return usePagination<InternalSelectItem<Value>>({
    items: displayItems,
    active: cursor < 0 || cursor >= displayItems.length ? 0 : cursor,
    renderItem(renderOpts) {
      const { item, isActive } = renderOpts;
      if (Separator.isSeparator(item)) {
        return ` ${item.separator}`;
      }

      const line = item.name || item.value;
      if (item.disabled) {
        const disabledLabel =
          typeof item.disabled === 'string' ? item.disabled : '(disabled)';
        return theme.style.disabledOption(`${line} ${disabledLabel}`);
      }

      const checkbox = item.checked ? theme.icon.checked : theme.icon.unchecked;
      const color = isActive ? theme.style.highlight : (x: string) => x;
      const cursor = isActive ? theme.icon.cursor : ' ';
      return color(`${cursor}${checkbox} ${line}`);
    },
    pageSize,
    loop,
  });
}

function renderHelpTip<Value>(context: SelectContext<Value>) {
  const { theme, instructions, displayItems, pageSize, behaviors, multiple } =
    context;
  let helpTipTop = '';
  let helpTipBottom = '';
  if (
    theme.helpMode === 'always' ||
    (theme.helpMode === 'auto' &&
      (instructions === undefined || instructions) &&
      (!behaviors.select ||
        !behaviors.deselect ||
        !behaviors.deleteOption ||
        !behaviors.setCursor))
  ) {
    if (instructions instanceof Function) {
      helpTipTop = instructions(context);
    } else {
      const keys = [];
      if (!behaviors.select && !behaviors.deselect) {
        if (multiple) {
          keys.push(`${theme.style.key('tab')} to select/deselect`);
        }
        keys.push(`${theme.style.key('enter')} to proceed`);
      }

      if (behaviors.select && !behaviors.deleteOption) {
        keys.push(`${theme.style.key('backspace')} to remove option`);
      }
      if (keys.length > 0) {
        helpTipTop = ` (Press ${keys.join(', ')})`;
      }
    }

    if (
      displayItems.length > pageSize &&
      (theme.helpMode === 'always' ||
        (theme.helpMode === 'auto' && !behaviors.setCursor))
    ) {
      helpTipBottom = `\n${theme.style.help('(Use arrow keys to reveal more options)')}`;
    }
  }
  return {
    top: helpTipTop,
    bottom: helpTipBottom,
  };
}

function renderFilterInput<Value>(
  { theme, filterInput, status, placeholder }: SelectContext<Value>,
  answer: string,
) {
  if (status === SelectStatus.UNLOADED) return '';
  let input = `\n${theme.icon.inputCursor} `;
  if (!answer && !filterInput) {
    input += theme.style.placeholder(placeholder);
  } else {
    input += `${answer ? `${answer} ` : ''}${filterInput}`;
  }
  return input;
}

/**
 * An inquirer select that supports multiple selections and filtering
 * @public
 * @group API
 * @example
 * ```ts
 * import { select } from 'inquirer-select-pro';
 * const answer = await select({
 *   message: 'select',
 *   options: async (input) => {
 *     const res = await fetch('<url>', {
 *        body: new URLSearchParams({ keyword: input }),
 *     });
 *     if (!res.ok) throw new Error('fail to get list!');
 *     return await res.json();
 *   },
 * });
 * ```
 */
export const select = createPrompt(
  <Value, Multiple extends boolean = true>(
    props: SelectProps<Value, Multiple>,
    done: (value: SelectValue<Value, Multiple>) => void,
  ) => {
    const {
      instructions,
      pageSize = 10,
      emptyText = 'No results.',
      placeholder = 'Type to search',
    } = props;

    const selectData = useSelect({
      ...props,
      onSubmitted: done,
    });

    const {
      status,
      selections,
      displayItems,
      error: errorMsg,
      multiple,
      enableFilter,
    } = selectData;

    const defaultTheme = useMemo(
      () => defaultSelectTheme(multiple),
      [multiple],
    );
    const theme = makeTheme<SelectTheme>(defaultTheme, props.theme, {
      icon: Object.assign(defaultTheme.icon, props.theme?.icon),
    });

    const isLoading =
      status === SelectStatus.UNLOADED || status === SelectStatus.FILTERING;

    const prefix = usePrefix({ theme, isLoading });

    const message = theme.style.message(props.message);

    const answer = theme.style.answer(
      theme.style.renderSelectedOptions(selections, displayItems),
    );

    if (status === SelectStatus.SUBMITTED) {
      return `${prefix} ${message} ${answer}`;
    }

    const context: SelectContext<Value> = {
      ...selectData,
      theme,
      pageSize,
      instructions,
      emptyText,
      placeholder,
    };

    const page = renderPage<Value>(context);

    const help = renderHelpTip<Value>(context);

    let error = '';
    if (errorMsg) {
      error = `\n${theme.style.error(errorMsg)}`;
    }

    const input = enableFilter
      ? renderFilterInput(context, answer)
      : ` ${answer}${ansiEscapes.cursorHide}`;

    return [
      `${prefix} ${message}${help.top}${input}`,
      `${page}${help.bottom}${error}`,
    ];
  },
);

export { Separator } from '@inquirer/core';
export { useSelect } from './useSelect';

export * from './types';
