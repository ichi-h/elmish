// @vitest-environment jsdom

import { describe, test, expect, vi } from "vitest";

import { elmish } from "../elmish";
import { Init, Update } from "../types";

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
  const initModel: Model = { count: 0 };

  const rendererMock = vi.fn();

  test("send message", () => {
    const { useElement, send } = elmish<Model, Msg, HTMLElement>(rendererMock);

    const button = document.createElement("button");
    button.addEventListener("click", () => send({ type: "increment" }));
    const p = document.createElement("p");

    useElement(initModel, update, ({ model }) => {
      p.innerText = model.count.toString();
      const div = document.createElement("div");
      div.appendChild(button);
      div.appendChild(p);
      return div;
    });

    button.click();

    expect(p.innerText).toBe("1");
  });

  test("send async message", async () => {
    const { useElement, send } = elmish<Model, Msg, HTMLElement>(rendererMock);

    const button = document.createElement("button");
    button.addEventListener("click", () => {
      for (let i = 0; i < 5; i++) {
        send({ type: "asyncIncrement" });
      }
      for (let i = 0; i < 2; i++) {
        send({ type: "asyncDecrement" });
      }
    });
    const p = document.createElement("p");

    useElement(initModel, update, ({ model }) => {
      p.innerText = model.count.toString();
      const div = document.createElement("div");
      div.appendChild(button);
      div.appendChild(p);
      return div;
    });

    button.click();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(p.innerText).toBe("3");
  });

  test("initialize element with function", async () => {
    const init: Init<Model, Msg> = () => [
      initModel,
      async () => new Promise((resolve) => resolve({ type: "increment" })),
    ];
    const { useElement } = elmish<Model, Msg, HTMLElement>(rendererMock);

    const p = document.createElement("p");

    useElement(init, update, ({ model }) => {
      p.innerText = model.count.toString();
      return p;
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(p.innerText).toBe("1");
  });
});
