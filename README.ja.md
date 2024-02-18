# @ichi-h/elmish

@ichi-h/elmishは、Elm Architectureを参考にした、UIフレームワークやUIライブラリに依存しない状態管理ライブラリです。@ichi-h/elmishはビジネスロジックをその他の複雑な要因から分離し、シンプルに保つことを目的としています。

**このライブラリの使用は推奨していません。** どうしてもこれを使いたい場合は、このリポジトリをforkして使用することをおすすめします。

## Usage

### Install

準備中...

```bash
npm install @ichi-h/elmish
```

### Setup

```typescript
// libs/elmish.ts
import { createElement } from "@ichi-h/elmish";

const useElement = createElement();
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
import { Model, Message } from "./data";

export const update = (model: Model, message: Message) => {
  switch (message.type) {
    case "increment": {
      return {
        newModel: { ...model, count: model.count + 1 },
      };
    }

    case "decrement": {
      return {
        newModel: { ...model, count: model.count - 1 },
      };
    }

    case "startReset": {
      return {
        newModel: { ...model, loader: "loading" },
        cmd: async () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ type: "endReset" });
            }, 1000);
          });
        },
      };
    }

    case "endReset": {
      return {
        newModel: { ...model, count: 0, loader: "idle" },
      };
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

## Elm Architectureとは？

Elm Architectureとは、Elm言語で採用されているWebアプリケーションを構築するためのアーキテクチャです。Elmの思想は様々なフレームワークに影響を与えており、もはやElm ArchitectureはWebフロントエンドに限らず、デスクトップアプリ、モバイルアプリ、ゲームといった、対話を必要とする様々なアプリケーションのアーキテクチャとして採用されています。

私が説明するのもなんですので、Elm Architectureの概要をドキュメントを引用してみましょう。

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

詳しくは [Elm言語のガイド](https://guide.elm-lang.org/) を参照してください。とても勉強になります！

## @ichi-h/elmishの思想

### UIライブラリと結婚するビジネスロジック

この世に存在する多くの状態管理システムは、UIライブラリに依存する設計になっています。これは宣言的UIを実現する上で必要なことです。つまり、状態が更新されれば、DOMを操作せずとも自動的にUIも変更できるようになるからです。非常に便利です！

しかし、これはしばしばビジネスロジックとUIライブラリや状態管理システムを密結合させてしまうことになります。以下のユースケースを満たす簡単なカウンターアプリケーションを、よく見かけるReactの書き方で書いてみましょう。

- +ボタンをクリックするとカウントが1増える
- -ボタンをクリックするとカウントが1減る
- リセットボタンをクリックすると、画面のカウントが「loading...」に変わり、1秒後にカウントが0となって再び表示される

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

ここで注目したい点は、上記のユースケースの中にReactは現れないということです。Reactはあくまでユースケースを実現する手段ですので、それは当たり前のことです。

では実際のコードはどのようになっているでしょうか？　countの値を管理するためにuseStateを使っています。これはカウンターが実現すべきビジネスロジックがReactのエコシステムに埋め込まれた状態です。

これの何が問題なのでしょうか？

例えば、Reactに破壊的変更があった場合、その分を修正する必要がありますが、ビジネスロジックがReactと密結合している場合、ビジネスロジックを一緒に書き直す可能性が非常に高いです、**ビジネスロジックが変わったわけでもないのに。**

また、Reactよりももっと魅力的なUIライブラリが現れ、リプレイスを行うことになった場合はどうでしょうか？　これは非常に大変です。なぜなら文字通り、ほぼ全てのコードを書き直す必要があるからです。

他にも、React固有の書き方がビジネスロジックの中に含まれると、それがノイズとなってロジックの本質的なところが見えにくくなることもあるでしょう。

もちろん、ここまでシンプルな例であれば問題になりません。しかし、プロダクションのビジネスロジックはもっと複雑で、状態管理も煩雑になります。そうした環境において、UIライブラリとビジネスロジックを分離することの重要度は高くなります。

### ビジネスロジックをクリーンに保とう

@ichi-h/elmishでは、UIの更新ロジックを外側から注入することで、ビジネスロジックをUIライブラリから切り離せるようにしました。

[Usageの例](#write-logic) の通り、data.tsとupdate.tsの中にReactは現れません。ここではビジネスロジックを記述することに集中しましょう。

あとはどんな方法でUIを表示するかを状況に応じて選択しましょう。

- [vanilla-typescript](#use-in-vanilla-typescript)
- [react](#use-in-react)
- [vue](#use-in-vue)

## なぜ@ichi-h/を「使わない」のか？

ここまでの話を聞いて、以下のように考える人がいるかもしれません。「ビジネスロジックを@ichi-h/elmishに依存させることはクリーンではない！」これは間違いなく正しく、それがこのライブラリの使用を推奨しない理由です。

そもそもこのライブラリは、私がWebフロントエンドの開発を行うとき、ビジネスロジックをクリーンに保つために、純粋なTypeScriptで記述したデザインパターンを使いまわすために作成したものです。そのため、私が作るプロダクトがこのライブラリに依存していたとしても大きな問題になりません、これを完全にコントロールできますからね。

もしクリーンにこだわるのであれば、@ichi-h/elmishをforkして使ったり、Elm Architectureにこだわらないのであれば、DDDやClean Architectureなどの設計を参考にすると良いでしょう。

## ライセンス

@ichi-h/elmishはMITライセンスのもとで公開されています。詳しくは[LICENSE](./LICENSE)を参照してください。
