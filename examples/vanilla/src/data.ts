import { elmish } from "@ichi-h/elmish";

import { renderer } from "./renderer";

export type Model = {
  count: number;
  loader: "idle" | "loading";
};

export type Message =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "startReset" }
  | { type: "endReset" };

export const init: Model = {
  count: 0,
  loader: "idle",
} as const;

export const { useElement, send } = elmish<Model, Message, HTMLElement>(
  renderer,
);
