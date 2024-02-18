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
