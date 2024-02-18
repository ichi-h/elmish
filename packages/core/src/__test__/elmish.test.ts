import { describe, test, expect, beforeEach } from "vitest";

import { elmish } from "../elmish";
import { Init, Key, Update } from "../types";

type Model = {
  count: number;
};

type Msg =
  | {
      type: "increment";
    }
  | {
      type: "decrement";
    }
  | {
      type: "asyncIncrement";
    }
  | {
      type: "asyncDecrement";
    };

const randomNum = () => Math.floor(Math.random() * 100);

const update: Update<Model, Msg> = (model, msg) => {
  switch (msg.type) {
    case "increment":
      return { count: model.count + 1 };
    case "decrement":
      return { count: model.count - 1 };
    case "asyncIncrement":
      return [
        model,
        async () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ type: "increment" });
            }, randomNum());
          }),
      ];
    case "asyncDecrement":
      return [
        model,
        async () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ type: "decrement" });
            }, randomNum());
          }),
      ];
  }
};

describe("elmish test", () => {
  let model: Model = { count: 0 };
  const key: Key<Model> = Symbol();

  const updateViewMock = (newModel: Model) => (model = newModel);

  beforeEach(() => {
    model = { count: 0 };
  });

  test("send message", () => {
    const useElement = elmish();
    const send = useElement(key, model, update, updateViewMock);
    send({ type: "increment" });
    expect(model.count).toBe(1);
  });

  test("send async message", async () => {
    const useElement = elmish();
    const send = useElement(key, model, update, updateViewMock);
    for (let i = 0; i < 10; i++) {
      send({ type: "asyncIncrement" });
      send({ type: "asyncDecrement" });
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(model.count).toBe(0);
  });

  test("initialize element with function", async () => {
    const init: Init<Model, Msg> = () => [
      model,
      async () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ type: "increment" });
          }, 1);
        }),
    ];
    const useElement = elmish();
    useElement(key, init, update, updateViewMock);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(model.count).toBe(1);
  });
});
