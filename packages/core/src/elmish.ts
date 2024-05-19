import { Queue } from "./queue";
import { BaseMessage, Init, Send, Update, UseElement, View } from "./types";

const isModel = <Model, Msg extends BaseMessage>(
  init: Init<Model, Msg>,
): init is Model => typeof init !== "function";

export const elmish = <Model, Msg extends BaseMessage, Html>(
  renderer: (html: Html) => void,
): {
  send: Send<Msg>;
  useElement: UseElement<Model, Msg, Html>;
} => {
  const queue = new Queue<Msg>();

  const send = (message: Msg) => {
    queue.push(message);
  };

  const useElement = (
    init: Init<Model, Msg>,
    update: Update<Model, Msg>,
    view: View<Model, Html>,
  ) => {
    const onPushHandler = (model: Model) => () => {
      const message = queue.pop();

      if (message === undefined) return;

      const result = update(model, message);
      const [newModel, cmd] = Array.isArray(result)
        ? [result[0], result[1]]
        : [result, undefined];
      cmd?.().then(send);
      if (queue.size() > 0) {
        onPushHandler(newModel)();
      } else {
        queue.onPush(onPushHandler(newModel));
        renderer(view({ model: newModel }));
      }
    };

    const [initModel, initCmd] = (() => {
      if (isModel(init)) return [init, undefined];
      const result = init();
      if (Array.isArray(result)) return [result[0], result[1]];
      return [result, undefined];
    })();

    queue.onPush(onPushHandler(initModel));
    initCmd?.().then(send);
    renderer(view({ model: initModel }));
  };

  return { send, useElement };
};
