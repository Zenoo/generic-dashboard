export type StateErrors<Fields extends string | undefined> = Partial<
  Record<Fields, string[]>
>;

export type State<Fields extends string | undefined = undefined> = {
  errors?: StateErrors<Fields>;
  message?: string | null;
};
