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

      const { newModel, cmd } = update(deepClone(model), message);
      store.put(key, newModel);
      view(newModel);
      if (cmd) cmd().then(send);
    };

    if (!store.exists(key)) {
      const { model: initModel, cmd: initCmd } = isModel(init)
        ? { model: init, cmd: undefined }
        : init();

      store.put(key, initModel);
      if (initCmd) initCmd().then(send);
    }

    return send;
  };
