export interface State<T> {
  put(value: T): void;
  get(): T | undefined;
}

export class ElmishState<T> implements State<T> {
  private value: T | undefined;

  put(value: T) {
    this.value = value;
  }

  get() {
    return this.value;
  }
}
