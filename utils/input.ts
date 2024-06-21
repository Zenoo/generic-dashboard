import {State} from '@/actions/State';

export type InputOptions = {
  required?: boolean;
};

export const input = <T extends string>(
  t: Function,
  state: State<T> | undefined,
  name: T,
  type: string,
  options?: InputOptions
) => ({
  name,
  label: t(name),
  type: type || 'text',
  error: !!state?.errors?.[name]?.length,
  helperText: state?.errors?.[name]?.join(' '),
  required: options?.required,
});
