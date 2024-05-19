import { VNode, createApp } from "vue";

let app = createApp({});

export const renderer = (html: VNode) => {
  if (app._container) app.unmount();
  app = createApp(html);
  app.mount("#app");
};
