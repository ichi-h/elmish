import { h } from "vue";

import "./style.css";
import App from "./App.vue";
import { init, useElement } from "./data";
import { update } from "./update";

useElement(init, update, ({ model }) => h(App, { model }));
