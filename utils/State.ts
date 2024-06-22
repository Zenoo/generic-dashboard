export type Message = {
  message: string;
  params?: Record<string, string | number | bigint>;
};

export type FormErrors<Fields extends string> = Partial<
  Record<Fields, Message[]>
>;

export type State<Fields extends string | undefined = undefined> = {
  formErrors?: Fields extends undefined
    ? undefined
    : FormErrors<Exclude<Fields, undefined>>;
  error?: Message;
  success?: Message;
};

export const error = (
  scope: string | null,
  message: string,
  params?: Record<string, string | number>
): State => ({
  error: {message: scope ? `${scope}.${message}` : message, params},
});

export const success = (
  scope: string | null,
  message: string,
  params?: Record<string, string | number>
): State => ({
  success: {message: scope ? `${scope}.${message}` : message, params},
});
