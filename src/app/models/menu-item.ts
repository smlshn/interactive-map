export interface MenuItem<T> {
  title: string;
  action: (val: T) => void;
}
