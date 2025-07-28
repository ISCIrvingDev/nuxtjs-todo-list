<template>
  <div
    id="descriptionModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="descriptionModalTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="descriptionModalTitle" class="modal-title">{{ title }}</h5>
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
          <textarea
            id="newDescription"
            class="form-control mt-1 mt-sm-3 border-0"
            rows="3"
            placeholder="Description"
            :value="description"
          />
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-dismiss="modal"
            @click="update"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropsModel } from "./props.model";

// * Props
/*const props = */ withDefaults(defineProps<PropsModel>(), {
  title: "Description",
  description: "",
});

// * Emits
const emit = defineEmits(["update"]);

// * Methods
const update = () => {
  emit(
    "update",
    (document.querySelector("#newDescription") as HTMLSelectElement | null)!
      .value
  );
};
</script>

<style>
textarea {
  resize: none;
}
</style>
