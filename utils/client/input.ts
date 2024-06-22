import {State} from '@/utils/State';

export type InputOptions = {
  required?: boolean;
};

export const input = <T extends string>(
  t: Function,
  scope: string,
  state: State<T> | undefined,
  name: T,
  type: string,
  options?: InputOptions
) => ({
  name,
  label: t(`${scope}.${name}`),
  type: type || 'text',
  error: !!state?.formErrors?.[name]?.length,
  helperText: state?.formErrors?.[name]
    ?.map(err => t(err.message, err.params))
    .join('. '),
  required: options?.required,
});
