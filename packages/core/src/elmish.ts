import { ElmishState, State } from "./state";
import { BaseMessage, Init, Update, UseElement } from "./types";

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const isModel = <Model, Msg extends BaseMessage>(
  init: Init<Model, Msg>,
): init is Model => typeof init !== "function";

export const elmish =
  <Model, Msg extends BaseMessage>(
    state: State<Model> = new ElmishState(),
  ): UseElement<Model, Msg> =>
  (
    init: Init<Model, Msg>,
    update: Update<Model, Msg>,
    view: (model: Model) => void,
  ) => {
    const send = (message: Msg) => {
      const model = state.get();

      if (!model) throw new Error("Model is not initialized");

      const result = update(deepClone(model), message);
      const [newModel, cmd] = Array.isArray(result)
        ? [result[0], result[1]]
        : [result, undefined];

      state.put(newModel);
      view(newModel);
      if (cmd) cmd().then(send);
    };

    if (state.get() === undefined) {
      const [initModel, initCmd] = (() => {
        if (isModel(init)) return [init, undefined];
        const result = init();
        if (Array.isArray(result)) return [result[0], result[1]];
        return [result, undefined];
      })();

      state.put(initModel);
      if (initCmd) initCmd().then(send);
    }

    return send;
  };
