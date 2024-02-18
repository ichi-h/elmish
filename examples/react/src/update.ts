import { Update } from "@ichi-h/elmish";

import { Model, Message } from "./data";

export const update: Update<Model, Message> = (model, message) => {
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
