export interface AutoCompleteResult {
  label: string;
  value: unknown;
}

export type AutoCompleteMapperFn<T = any> = (list: T[]) => AutoCompleteResult[];
