# inquirer-select-pro

<a href="https://www.npmjs.com/package/inquirer-select-pro" target="_blank"><img alt="NPM Version" src="https://img.shields.io/npm/v/inquirer-select-pro"></a> <a href="https://codecov.io/gh/jeffwcx/inquirer-select-pro" target="_blank"><img alt="codecov" src="https://codecov.io/gh/jeffwcx/inquirer-select-pro/graph/badge.svg?token=tjROGqr2yx"></a> <a href="https://github.com/jeffwcx/inquirer-select-pro/actions?query=branch%3Amain" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/jeffwcx/inquirer-select-pro/.github/workflows/build.yml?branch=main" alt="CI" /></a>

An enhanced Inquirer select component that provides powerful features including multiple selections, real-time filtering, and dynamic search capabilities.

## Installation

```bash
# Using pnpm
pnpm i inquirer-select-pro

# Using npm
npm i inquirer-select-pro

# Using yarn
yarn add inquirer-select-pro
```

## Quick Demo

Experience it immediately with:

```bash
npx @jeffwcx/gitignore
```

[![asciicast](https://asciinema.org/a/658848.svg)](https://asciinema.org/a/658848)

> This demo showcases a CLI tool for generating `.gitignore` files: [@jeffwcx/gitignore](https://github.com/jeffwcx/jeffwcx-config/blob/main/packages/gitignore).

## Usage Examples

### Multiple Selection with Async Data Source

```ts
import { select } from 'inquirer-select-pro';

const answer = await select({
  message: 'Select options:',
  options: async (input) => {
    const res = await fetch('<url>', {
      body: new URLSearchParams({ keyword: input }),
    });
    if (!res.ok) throw new Error('Failed to retrieve options!');
    return await res.json();
  },
});
```

### Single Selection (Radio Mode)

```ts
import { select } from 'inquirer-select-pro';

const answer = await select({
  message: 'Choose an option:',
  multiple: false,
  options: [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' },
  ],
});
```

### Set default value

Using `defaultValue`

```ts
import { select } from 'inquirer-select-pro';

// checkbox moode
const answer = await select({
  message: 'select...',
  defaultValue: ['apple'],
  options: [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' },
  ],
});
```

```ts
import { select } from 'inquirer-select-pro';

// radio moode
const answer = await select({
  message: 'select...',
  defaultValue: 'apple',
  options: [
    { name: 'Apple', value: 'apple' },
    { name: 'Banana', value: 'banana' },
  ],
});
```

### Input Clearing on Selection

The `clearInputWhenSelected` option automatically clears the filter input when an option is selected, refreshing the displayed option list.

### Two-Step Deletion (Multiple Selection Mode)

When `confirmDelete` is enabled, pressing the delete key first focuses on the option to be removed, and pressing it a second time confirms the deletion.

```ts
import { select } from 'inquirer-select-pro';

const answer = await select({
  message: 'Select options:',
  confirmDelete: true,
  options: async (input) => {
    const res = await fetch('<url>', {
      body: new URLSearchParams({ keyword: input }),
    });
    if (!res.ok) throw new Error('Failed to retrieve options!');
    return await res.json();
  },
});
```

## API Reference

### select()

The main function that creates an enhanced select prompt with support for multiple selections and filtering.

#### Parameters

- `config` [**_SelectProps_**](./src/types.ts#L198) <!-- -->**_\<Value, Multiple>_**
  - Configuration object that defines the behavior and appearance of the select prompt

#### Returns

**_CancelablePromise_** <!-- -->**_\<Value>_**

- A promise that resolves to the selected value(s) and can be canceled

#### Example

```ts
import { select } from 'inquirer-select-pro';

const answer = await select({
  message: 'Select an option:',
  options: async (input) => {
    const res = await fetch('<url>', {
      body: new URLSearchParams({ keyword: input }),
    });
    if (!res.ok) throw new Error('Failed to retrieve options!');
    return await res.json();
  },
});
```

### useSelect()

> [!WARNING]
> This API is provided as a beta preview for developers and may change based on feedback. Not recommended for production environments.

#### Type Definition

```typescript
declare function useSelect<Value, Multiple extends boolean>(
  props: UseSelectOptions<Value, Multiple>,
): UseSelectReturnValue<Value>;
```

#### Parameters

- `props` [**_UseSelectOptions_**](./src/types.ts#L63)<!-- -->**_\<Value, Multiple>_**
  - Configuration options for the select hook

#### Returns

[**_UseSelectReturnValue_**](./src/types.ts#L170)<!-- -->**_\<Value>_**

- An object containing the state and methods for controlling the select component

### Theming Options

#### Type Definition

```ts
export type SelectTheme = {
  prefix: string; // Prefix displayed before the prompt
  spinner: {
    interval: number; // Animation speed in milliseconds
    frames: string[]; // Animation frames for loading state
  };
  icon: {
    checked: string; // Icon for selected options
    unchecked: string; // Icon for unselected options
    cursor: string; // Icon for the cursor position
    inputCursor: string; // Text before the input field
  };
  style: {
    answer: (text: string) => string; // Style for the final answer
    message: (text: string) => string; // Style for the prompt message
    error: (text: string) => string; // Style for error messages
    help: (text: string) => string; // Style for help text
    highlight: (text: string) => string; // Style for highlighted text
    key: (text: string) => string; // Style for key indicators
    disabledOption: (text: string) => string; // Style for disabled options
    renderSelectedOptions: <T>(
      selectedOptions: ReadonlyArray<SelectOption<T>>,
      allOptions: ReadonlyArray<SelectOption<T> | Separator>,
    ) => string; // Custom renderer for selected options
    emptyText: (text: string) => string; // Style for empty state text
    placeholder: (text: string) => string; // Style for placeholder text
  };
  helpMode: 'always' | 'never' | 'auto'; // When to display help information
};
```

#### Example

```ts
await select({
  message: 'Choose movie:',
  placeholder: 'search',
  options: () => top100Films,
  pageSize: 2,
  instructions: false,
  theme: {
    icon: {
      inputCursor: 'filter: ',
      checked: ' √',
      unchecked: ' ',
    },
    style: {
      placeholder: (text: string) => `${text}...`,
    },
  },
});
```

This produces the following appearance:

```
? Choose movie:
filter:  The Shawshank Redemption (1994)
> √ The Shawshank Redemption (1994)
    The Godfather (1972)

```

## Contributing

### Getting Started

1. Fork the repository

2. Set up your development environment:

```bash
# Clone your fork
git clone https://github.com/yourname/inquirer-select-pro.git
cd inquirer-select-pro

# Install dependencies
pnpm i

# Create a feature branch
git checkout -b my-new-feature

# Start development
pnpm dev

# Build the project
pnpm build

# Run tests
pnpm test
```

> [!NOTE]
> The `pnpm dev` command allows you to specify which demo to run.

### Available Demos

You can run any of these demo types:

- `local` - Basic local options
- `remote` - Remote data fetching
- `filter-remote` - Filtered remote data
- `filter-local` - Filtered local data

Example:

```bash
pnpm dev filter-remote
```

### Configurable Parameters

You can customize the demo behavior with these parameters:

- `filter` - Enable/disable filtering
- `clearInputWhenSelected` - Clear input on selection
- `required` - Make selection required
- `loop` - Enable/disable option list looping
- `multiple` - Enable/disable multiple selection
- `canToggleAll` - Allow toggling all options
- `confirmDelete` - Enable two-step deletion
- `selectFocusedOnSubmit` - Select focused item on submit

Example:

```bash
pnpm dev filter-demo --multiple=false
```

### Submitting Changes

3. Commit your changes with a descriptive message:

   ```bash
   git commit -am 'Add some feature'
   ```

4. Push to your branch:

   ```bash
   git push origin my-new-feature
   ```

5. Create a pull request through the GitHub interface
