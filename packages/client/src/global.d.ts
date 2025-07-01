type TSFixMe = any;
type TSIgnore = any;
type TSAny = any; // to be used only when type is not possible
type StringOrNumber = string | number;
type MapOf<T> = { [t: string]: T };
type Maybe<T> = T | undefined | null;
type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};
type Tuple<P, K> = { v1: P; v2: K };
type TypePayload<T = string, P = TSAny> = {
  type: T;
  payload?: P;
};
