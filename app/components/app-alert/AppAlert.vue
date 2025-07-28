<template>
  <transition name="slide-fade">
    <div v-if="show" id="alert" :class="alertType" role="alert">
      {{ msn }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import type { PropsModel } from "./props.model";

// * Props
const props = withDefaults(defineProps<PropsModel>(), {
  msn: "Invlid format",
  show: false,
  type: "success",
});

// * Emits
const emit = defineEmits(['fadeOut'])

// * Consts
const time = 6000

// * Computed
const alertType = computed(() =>
  props.type == "success"
    ? "alert alert-success text-center"
    : "alert alert-danger text-center"
);

// * Watch
// Se necesita usar una "getter function" para acceder a una "prop"
watch(() => props.show, (newVal/*, oldVal*/) => {
  if (newVal)
    setTimeout(() => {
      emit("fadeOut");
    }, time);
});
</script>

<style>
#alert {
  position: fixed;
  top: 7rem;
  right: 1rem;
  width: 18rem;
}

/* .fade-enter-active, .fade-leave-active {
        transition: opacity 3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    } */

.slide-fade-enter-active {
  transition: all 1s linear;
}
.slide-fade-leave-active {
  transition: all 1s ease-in;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(4rem);
  opacity: 0;
}
</style>
