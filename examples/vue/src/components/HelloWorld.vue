<script setup lang="ts">
import { ref } from "vue";

import { useElement } from "../libs/elmish";
import { Model, init, key } from "../data";
import { update } from "../update";

defineProps<{ msg: string }>();

const model = ref(init);
const updateView = (newModel: Model) => (model.value = newModel);

const send = useElement(key, model.value, update, updateView);

const increment = () => send({ type: "increment" });

const decrement = () => send({ type: "decrement" });

const reset = () => send({ type: "startReset" });
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="decrement">-</button>
    <button type="button" @click="reset">reset</button>
    <button type="button" @click="increment">+</button>
    <p v-if="model.loader === 'loading'">loading...</p>
    <p v-else-if="model.loader === 'idle'">count is {{ model.count }}</p>

    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
