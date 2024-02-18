import { Key } from "./types";

export class Store {
  private map = new Map<Symbol, unknown>();

  put<T>(key: Key<T>, value: T) {
    this.map.set(key, value);
  }

  read<T>(key: Key<T>) {
    const value = this.map.get(key);
    if (value === undefined) {
      throw new Error("Key not found");
    }
    return value as T;
  }

  exists<T>(key: Key<T>) {
    return this.map.has(key);
  }
}
