import { Store } from "./store";
import { BaseMessage, Init, Key, Update } from "./types";

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const isModel = <Model, Msg extends BaseMessage>(
  init: Init<Model, Msg>,
): init is Model => typeof init !== "function";

export const createElement =
  (store: Store) =>
  <Model, Msg extends BaseMessage>(
    key: Key<Model>,
    init: Init<Model, Msg>,
    update: Update<Model, Msg>,
    view: (model: Model) => void,
  ) => {
    const send = (message: Msg) => {
      const model = store.read(key) as Model;

      const result = update(deepClone(model), message);
      const [newModel, cmd] = Array.isArray(result)
        ? [result[0], result[1]]
        : [result, undefined];

      store.put(key, newModel);
      view(newModel);
      if (cmd) cmd().then(send);
    };

    if (!store.exists(key)) {
      const [initModel, initCmd] = (() => {
        if (isModel(init)) return [init, undefined];
        const result = init();
        if (Array.isArray(result)) return [result[0], result[1]];
        return [result, undefined];
      })();

      store.put(key, initModel);
      if (initCmd) initCmd().then(send);
    }

    return send;
  };
