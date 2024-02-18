// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Key<_T> extends Symbol {}

export type BaseMessage = { type: string };

export type Send<Msg extends BaseMessage> = (message: Msg) => void;

type ReturnModel<Model, Msg extends BaseMessage> =
  | Model
  | [Model]
  | [Model, undefined]
  | [Model, () => Promise<Msg>];

export type Update<Model, Msg extends BaseMessage> = (
  model: Model,
  message: Msg,
) => ReturnModel<Model, Msg>;

export type View<Model> = (model: Model) => void;

export type Init<Model, Msg extends BaseMessage> =
  | Model
  | (() => ReturnModel<Model, Msg>);
