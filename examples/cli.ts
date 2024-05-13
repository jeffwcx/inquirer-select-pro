import { argv } from 'node:process';
import { type SelectProps, select } from '../src/index';
import {
  filterLocalData,
  filterRemoteData,
  remoteData,
  top100Films,
} from '../tests/data';

function createDemo<Value, Multiple extends boolean = true>(
  baseProps: SelectProps<Value, Multiple>,
) {
  return async (props: Partial<SelectProps<Value, Multiple>>) => {
    const answer = await select<Value, Multiple>({
      ...baseProps,
      ...props,
    });
    console.log(answer);
  };
}

const options = {
  local: createDemo({
    message: 'Select all the movies you want to watch:',
    options: top100Films,
  }),
  remote: createDemo({
    message: 'Select all the movies you want to watch:',
    options: remoteData,
  }),
  'filter-remote': createDemo({
    message: 'Select all the movies you want to watch:',
    options: filterRemoteData,
  }),
  'filter-local': createDemo({
    message: 'Select all the movies you want to watch:',
    options: filterLocalData,
  }),
};

type Demos = keyof typeof options;

const availableOptions = [
  'filter',
  'clearInputWhenSelected',
  'required',
  'loop',
  'multiple',
  'canToggleAll',
];

let whichDemo: Demos | null;

const demos = Object.keys(options) as Demos[];
const flags: any = {};
for (let index = argv.length - 1; index >= 0; index--) {
  const arg = argv[index];
  let g = null;
  if (demos.indexOf(arg as Demos) >= 0) {
    whichDemo = arg as Demos;
    break;
  } else if ((g = arg.match(/--(\w+)=?(true|false)?/))) {
    if (availableOptions.includes(g[1])) {
      flags[g[1]] = g[2] === undefined || g[2] === 'true';
    }
  }
}

// @ts-ignore
if (!whichDemo) {
  whichDemo = await select({
    message: 'Which demo do you want to run?',
    multiple: false,
    options: demos.map((value) => ({
      name: value,
      value,
    })),
  });
}

options?.[whichDemo as keyof typeof options]?.(flags);
