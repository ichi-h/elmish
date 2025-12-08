import { Model, init, useElement } from "./data";
import { update } from "./update";

export function setupCounter(
  counter: HTMLParagraphElement,
  incrementBtn: HTMLButtonElement,
  decrementBtn: HTMLButtonElement,
  resetBtn: HTMLButtonElement,
) {
  const updateView = (newModel: Model) => {
    if (newModel.loader === "loading") {
      counter.innerHTML = "loading...";
    } else {
      counter.innerHTML = `count is ${newModel.count}`;
    }
  };

  const send = useElement(init, update, updateView);

  incrementBtn.addEventListener("click", () => send({ type: "increment" }));
  decrementBtn.addEventListener("click", () => send({ type: "decrement" }));
  resetBtn.addEventListener("click", () => send({ type: "startReset" }));

  send({ type: "startReset" });
}
