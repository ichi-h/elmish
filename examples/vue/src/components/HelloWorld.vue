<script setup lang="ts">
import { ref } from "vue";

import { Model, init, useElement } from "../data";
import { update } from "../update";

defineProps<{ msg: string }>();

const model = ref(init);
const updateView = (newModel: Model) => (model.value = newModel);

const send = useElement(model.value, update, updateView);

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
  </div>
</template>
