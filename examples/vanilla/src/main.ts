import "./style.css";
import { setupCounter } from "./counter.ts";
import typescriptLogo from "./typescript.svg";

import viteLogo from "/vite.svg";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="decrement" type="button">-</button>
      <button id="reset" type="button">reset</button>
      <button id="increment" type="button">+</button>
    </div>
    <p class="read-the-docs" id="counter">
    </p>
  </div>
`;

setupCounter(
  document.querySelector<HTMLParagraphElement>("#counter")!,
  document.querySelector<HTMLButtonElement>("#increment")!,
  document.querySelector<HTMLButtonElement>("#decrement")!,
  document.querySelector<HTMLButtonElement>("#reset")!,
);
