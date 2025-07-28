<template>
  <div
    id="confirmModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="confirmModalTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 id="confirmModalTitle" class="modal-title">Confirm</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body">
          Do you really want to delete this {{ item }}?
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-success"
            data-dismiss="modal"
            @click="done"
          >
            Yes
          </button>
          <button
            type="button"
            class="btn btn-outline-danger"
            data-dismiss="modal"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropsModel } from "./props.model";

// * Props
/*const props = */withDefaults(defineProps<PropsModel>(), {
  item: "",
});

// * Emits
const emit = defineEmits(["done"]);

// * Methods
const done = () => {
  emit("done");
};
</script>

<style>
/* x */
</style>
