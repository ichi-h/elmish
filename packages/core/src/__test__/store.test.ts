import { describe, test, expect } from "vitest";

import { Store } from "../store";
import { Key } from "../types";

describe("store test", () => {
  test("create new data", () => {
    const store = new Store();
    const data = 1;
    const key: Key<number> = Symbol();
    store.put(key, data);
    expect(store.read(key)).toBe(data);
  });

  test("update existing data", () => {
    const store = new Store();
    const data = 1;
    const key: Key<number> = Symbol();
    store.put(key, data);
    const newData = 2;
    store.put(key, newData);
    expect(store.read(key)).toBe(newData);
  });

  test("read non-existing data", () => {
    const store = new Store();
    const key: Key<number> = Symbol();
    expect(() => store.read(key)).toThrow("Key not found");
  });

  test("check if data exists", () => {
    const store = new Store();
    const data = 1;
    const key: Key<number> = Symbol();
    store.put(key, data);
    expect(store.exists(key)).toBe(true);
  });

  test("check if non-existing data exists", () => {
    const store = new Store();
    const key: Key<number> = Symbol();
    expect(store.exists(key)).toBe(false);
  });
});
