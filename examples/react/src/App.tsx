import reactLogo from "./assets/react.svg";

import viteLogo from "/vite.svg";

import "./App.css";
import { init, useElement, send } from "./data";
import { update } from "./update";

useElement(init, update, ({ model }) => {
  const increment = () => send({ type: "increment" });
  const decrement = () => send({ type: "decrement" });
  const reset = () => send({ type: "startReset" });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={decrement}>-</button>
        <button onClick={reset}>reset</button>
        <button onClick={increment}>+</button>
        {model.loader === "loading" && <p>loading...</p>}
        {model.loader === "idle" && <p>count is {model.count}</p>}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
});
