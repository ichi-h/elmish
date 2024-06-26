export type BaseMessage = { type: string };

export type Send<Msg extends BaseMessage> = (message: Msg) => void;

export type Cmd<Msg extends BaseMessage> = () => Promise<Msg>;

export type ReturnModel<Model, Msg extends BaseMessage> =
  | Model
  | [Model]
  | [Model, undefined]
  | [Model, Cmd<Msg>];

export type Update<Model, Msg extends BaseMessage> = (
  model: Model,
  message: Msg,
) => ReturnModel<Model, Msg>;

export type View<Model, Html> = ({ model }: { model: Model }) => Html;

export type Init<Model, Msg extends BaseMessage> =
  | Model
  | (() => ReturnModel<Model, Msg>);

export type UseElement<Model, Msg extends BaseMessage, Html> = (
  init: Init<Model, Msg>,
  update: Update<Model, Msg>,
  view: View<Model, Html>,
) => void;
