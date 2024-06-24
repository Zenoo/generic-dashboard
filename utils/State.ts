export type Message = {
  message: string;
  params?: Record<string, string | number | bigint>;
};

export type FormErrors<Fields extends string> = Partial<
  Record<Fields, Message[]>
>;

export type State<
  Data = undefined,
  Fields extends string | undefined = undefined,
> = {
  formErrors?: FormErrors<Exclude<Fields, undefined>>;
  error?: Message;
  success?: Message;
  data?: Data;
};

export const error = (
  scope: string | null,
  message: string,
  params?: Record<string, string | number>
): State => ({
  error: {message: scope ? `${scope}.${message}` : message, params},
});

export const success = <Data>(
  scope: string | null,
  data: Data,
  message: string,
  params?: Record<string, string | number>
): State<Data> => ({
  success: {message: scope ? `${scope}.${message}` : message, params},
  data,
});
