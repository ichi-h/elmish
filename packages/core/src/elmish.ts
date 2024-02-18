import { createElement } from "./element";
import { Store } from "./store";

export const elmish = () => {
  const store = new Store();
  const useElement = createElement(store);
  return useElement;
};
