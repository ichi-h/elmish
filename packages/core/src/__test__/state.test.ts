import { describe, test, expect } from "vitest";

import { ElmishState } from "../state";

describe("store test", () => {
  test("create new data", () => {
    const store = new ElmishState<number>();
    const data = 1;
    store.put(data);
    expect(store.get()).toBe(data);
  });

  test("update existing data", () => {
    const store = new ElmishState<number>();
    const data = 1;
    store.put(data);
    const newData = 2;
    store.put(newData);
    expect(store.get()).toBe(newData);
  });

  test("get non-existing data", () => {
    const store = new ElmishState<number>();
    expect(store.get()).toBe(undefined);
  });
});
