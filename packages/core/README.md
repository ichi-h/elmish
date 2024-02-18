# @ichi-h/elmish

[![LICENSE](https://img.shields.io/github/license/ichi-h/elmish)](./LICENSE) [![npm version](https://img.shields.io/npm/v/@ichi-h/elmish.svg?style=flat)](https://www.npmjs.com/package/@ichi-h/elmish)

日本語版は[こちら](./README.ja.md)

@ichi-h/elmish is a state management library that is independent of UI frameworks and UI libraries, with reference to Elm Architecture. @ichi-h/elmish aims to keep business logic separate from other complex factors and keep it simple.

## Usage

### Install

```bash
npm install @ichi-h/elmish
```

### Setup

```typescript
// libs/elmish.ts
import { elmish } from "@ichi-h/elmish";

const useElement = elmish();
```

[#write-logic]: write-logic

### Write logic

```typescript
// data.ts
import { Key } from "@ichi-h/elmish";

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

export const key: Key<Model> = Symbol();
```

```typescript
// update.ts
import { Update } from "@ichi-h/elmish";

import { Model, Message } from "./data";

export const update: Update<Model, Message> = (model, message) => {
  switch (message.type) {
    case "increment": {
      return { ...model, count: model.count + 1 };
    }

    case "decrement": {
      return { ...model, count: model.count - 1 };
    }

    case "startReset": {
      return [
        { ...model, loader: "loading" },
        async () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ type: "endReset" });
            }, 1000);
          });
        },
      ];
    }

    case "endReset": {
      return { ...model, count: 0, loader: "idle" };
    }
  }
};
```

[#use-in-vanilla-typescript]: use-in-vanilla-typescript

### Use in Vanilla TypeScript

```typescript
// counter.ts
import { Model, init, key } from "./data";
import { useElement } from "./libs/elmish";
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

  const send = useElement(key, init, update, updateView);

  incrementBtn.addEventListener("click", () => send({ type: "increment" }));
  decrementBtn.addEventListener("click", () => send({ type: "decrement" }));
  resetBtn.addEventListener("click", () => send({ type: "startReset" }));

  send({ type: "startReset" });
}
```

```typescript
// main.ts
import { setupCounter } from "./counter";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="decrement" type="button">-</button>
    <button id="reset" type="button">reset</button>
    <button id="increment" type="button">+</button>
    <p id="counter"></p>
  </div>
`;

setupCounter(
  document.querySelector<HTMLParagraphElement>("#counter")!,
  document.querySelector<HTMLButtonElement>("#increment")!,
  document.querySelector<HTMLButtonElement>("#decrement")!,
  document.querySelector<HTMLButtonElement>("#reset")!,
);
```

[#use-in-react]: use-in-react

### Use in React

```tsx
import { init, key } from "./data";
import { useElement } from "./lib/elmish";
import { update } from "./update";

export const App = () => {
  const [model, setModel] = useState(init);

  const send = useElement(key, model, update, setModel);

  const increment = () => send({ type: "increment" });
  const decrement = () => send({ type: "decrement" });
  const reset = () => send({ type: "startReset" });

  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>
      <button onClick={increment}>+</button>
      {model.loader === "loading" && <p>loading...</p>}
      {model.loader === "idle" && <p>count is {model.count}</p>}
    </div>
  );
};
```

[#use-in-vue]: use-in-vue

### Use in Vue

```vue
<script setup lang="ts">
import { ref } from "vue";

import { useElement } from "./libs/elmish";
import { Model, init, key } from "./data";
import { update } from "./update";

const model = ref(init);
const updateView = (newModel: Model) => (model.value = newModel);

const send = useElement(key, model.value, update, updateView);

const increment = () => send({ type: "increment" });
const decrement = () => send({ type: "decrement" });
const reset = () => send({ type: "startReset" });
</script>

<template>
  <div>
    <button type="button" @click="decrement">-</button>
    <button type="button" @click="reset">reset</button>
    <button type="button" @click="increment">+</button>
    <p v-if="model.loader === 'loading'">loading...</p>
    <p v-else-if="model.loader === 'idle'">count is {{ model.count }}</p>
  </div>
</template>
```

## What is Elm Architecture?

The Elm Architecture is an architecture for building web applications that uses the Elm language. Elm Architecture is no longer limited to web front-ends, but has been adopted as the architecture for a variety of applications that require interaction, such as desktop apps, mobile apps, and games.

I'm not good enough to explain this, so I quote the documentation for an overview of Elm Architecture.

> ![Diagram of The Elm Architecture](./assets/elm_architecture.svg)
>
> The Elm program produces HTML to show on screen, and then the computer sends back messages of what is going on. "They clicked a button!"
>
> What happens within the Elm program though? It always breaks into three parts:
>
> - **Model** — the state of your application
> - **View** — a way to turn your state into HTML
> - **Update** — a way to update your state based on messages
>
> These three concepts are the core of **The Elm Architecture**.
>
> \- [The Elm Architecture · An Introduction to Elm](https://guide.elm-lang.org/architecture/)

See [Guide to the Elm Language](https://guide.elm-lang.org/) for more information. It is very informative!

## @ichi-h/elmish's philosophy.

### Business logic married with UI library

Many state management systems in this world are designed to rely on UI libraries. This is necessary to achieve a declarative UI. This is necessary for a declarative UI, because when the state is updated, the UI can automatically change without manipulating the DOM. This is very convenient!

However, this often leads to tightly coupling business logic with UI libraries and state management systems. Let's write a simple counter application that satisfies the following requirements in the common React writing style.

- Clicking the + button increases the count by 1.
- Clicking the - button decreases the count by 1.
- When the reset button is clicked, the count on the screen changes to "loading..." and after 1 second, the count becomes 0 and the count is displayed again.

```tsx
export const App = () => {
  const [count, setCount] = useState(0);
  const [loader, setLoader] = useState<"idle" | "loading">("idle");

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => {
    setLoader("loading");
    setTimeout(() => {
      setCount(0);
      setLoader("idle");
    }, 1000);
  };

  return (
    <div>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>
      <button onClick={increment}>+</button>
      {loader === "loading" && <p>loading...</p>}
      {loader === "idle" && <p>count is {count}</p>}
    </div>
  );
};
```

It is important to note that React does not appear in any of the above use cases, which is natural since React is only a means to achieve the use cases.

So what does the actual code look like? I used useState to manage the value of count. This means that the business logic of the use case that the counter should implement is embedded in the React ecosystem.

What is the problem with this?

For example, if there are some breaking changes in React, you need to fix that, but if your business logic is tightly coupled with React, you are very likely to rewrite the business logic together, **even though the business logic has not changed.**

And what if a more attractive UI library than React appears and you have to replace it? This is very hard. Because you would literally have to rewrite almost all of the code.

Also, if the React-specific writing style is included in the business logic, it may become noise and make it difficult to see the essential aspects of the logic.

Of course, if the example were this simple, it would not be a problem. However, production business logic is much more complex, and state management can be cumbersome. In such an environment, the separation of UI library and business logic becomes more important.

### Keep your business logic readable!

In @ichi-h/elmish, the UI update logic is injected from the outside so that the business logic can be decoupled from the UI library.

As shown in [Usage example](#write-logic), React does not appear in data.ts and update.ts. Let's concentrate on writing business logic here.

Then choose what method to use to display the UI, depending on the situation.

- [vanilla-typescript](#use-in-vanilla-typescript)
- [react](#use-in-react)
- [vue](#use-in-vue)
- etc...

## Why use @ichi-h/elmish?

The benefit of using @ichi-h/elmish is almost the same as separating the business logic from the UI library. In other words:

- Concentrate on writing business logic based on the Elm Architecture without worrying about how to write UI libraries.
- Even if there are disruptive changes to the UI library, your business logic can be protected from those changes.
- Eliminating the UI library-specific writing style keeps _noise_ out of your business logic and keeps the code easy to understand.
- Your business logic can be reused when replacing UI libraries.

## Why NOT use @ichi-h/elmish?

After hearing all this, you may be thinking: "Having business logic dependent on @ichi-h/elmish is not clean!" This is definitely correct. If there are destructive changes to this library, you may need to rewrite the business logic. Therefore, if clean code is important to you, you should not use @ichi-h/elmish.

If you insist on cleanliness, you can refer to designs such as DDD and Clean Architecture, and if you are more concerned about Elm Architecture, you can also implement a mechanism like this library on your own.

## License

@ichi-h/elmish is licensed under the MIT License. See [LICENSE](./LICENSE) for the full license text.
