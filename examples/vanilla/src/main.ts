import "./style.css";
import typescriptLogo from "./typescript.svg";
import { init, send, useElement } from "./data";
import { update } from "./update";

import viteLogo from "/vite.svg";

useElement(init, update, ({ model }) => {
  const app = document.createElement("div");
  app.id = "app";
  app.innerHTML = `
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
  `;

  const card = document.createElement("div");
  card.classList.add("card");

  const incrementBtn = document.createElement("button");
  incrementBtn.id = "increment";
  incrementBtn.type = "button";
  incrementBtn.innerText = "+";
  incrementBtn.addEventListener("click", () => send({ type: "increment" }));

  const decrementBtn = document.createElement("button");
  decrementBtn.id = "decrement";
  decrementBtn.type = "button";
  decrementBtn.innerText = "-";
  decrementBtn.addEventListener("click", () => send({ type: "decrement" }));

  const resetBtn = document.createElement("button");
  resetBtn.id = "reset";
  resetBtn.type = "button";
  resetBtn.innerText = "reset";
  resetBtn.addEventListener("click", () => send({ type: "startReset" }));

  card.appendChild(decrementBtn);
  card.appendChild(resetBtn);
  card.appendChild(incrementBtn);

  const counter = document.createElement("p");
  counter.id = "counter";
  counter.classList.add("read-the-docs");
  if (model.loader === "loading") {
    counter.innerText = "loading...";
  } else {
    counter.innerText = `count is ${model.count}`;
  }

  app.appendChild(card);
  app.appendChild(counter);

  return app;
});
