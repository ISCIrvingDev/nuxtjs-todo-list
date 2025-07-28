<template>
  <div class="container">
    <!-- {{$data}} -->
    <!-- <hr>
    {{description}}
    <hr> -->
    <section>
      <form class="my-4" @submit.prevent="addTask">
        <div class="form-group row">
          <div class="col-12 col-sm-10">
            <input
              id="task"
              v-model="formData.task"
              type="text"
              class="form-control"
              minlength="5"
              maxlength="25"
              pattern="[A-Za-z]{2}[ _A-Za-z0-9]{1,22}"
              title="It has to start with two letters, have at least 5 characters and end with a letter or a number"
              placeholder="Task"
              required
            >

            <textarea
              id="description"
              v-model="formData.description"
              class="form-control mt-1 mt-sm-3"
              rows="3"
              placeholder="Description"
            />
          </div>

          <div class="col-12 col-sm-2 mt-2 mt-sm-0">
            <button type="submit" class="btn btn-outline-dark">Add</button>
          </div>
        </div>
      </form>
    </section>

    <section>
      <input
        id="searchIcon"
        v-model="search"
        type="text"
        class="form-control"
        maxlength="25"
        placeholder="Search..."
      >
    </section>

    <section class="table-responsive-sm">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col" class="col-1">ID</th>
            <th scope="col" class="col-2">Details</th>
            <th scope="col" class="col-2">Done</th>
            <th scope="col" class="col-5">Task</th>
            <th scope="col" class="col-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in searchFilter" :key="row.id">
            <th scope="row">{{ rows.indexOf(row) + 1 }}</th>
            <th scope="row">
              <a
                href="#"
                class="far fa-window-restore"
                data-toggle="modal"
                data-target="#descriptionModal"
                @click="setRow(row)"
              />
            </th>
            <td>
              <div class="form-check">
                <input
                  v-model="row.done"
                  class="form-check-input position-static"
                  type="checkbox"
                  @change="
                    setRow(row);
                    requestToServer = 'PUT';
                    updateDone();
                  "
                >
              </div>
            </td>
            <td>
              <input
                id="updateTask"
                v-model="row.task"
                class="rounded bg-text-silver bg-text-silver border-0"
                :class="{ taskDone: row.done }"
                type="text"
                maxlength="25"
                pattern="[A-Za-z]{2}[ _A-Za-z0-9]{1,22}"
                title="It has to start with two letters, have at least 5 characters and end with a letter or a number"
                required
                @keyup.enter="updateTask(row)"
              >
            </td>
            <td>
              <button
                type="button"
                class="btn btn-outline-danger"
                data-toggle="modal"
                data-target="#confirmModal"
                @click="setRow(row)"
              >
                X
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <AppAlert :show="show" :msn="msn" :type="type" @fade-out="show = !show" />
    <AppConfirmModal item="task" @done="deleteTask" />
    <AppDescriptionModal
      ref="descriptionTask"
      :title="title"
      :description="description"
      @update="updateTaskDescription"
    />
  </div>
</template>

<script setup lang="ts">
// import ConfirmModal from "./ConfirmModal.vue";
// import Alert from "./Alert.vue";
// import DescriptionModal from "./DescriptionModal.vue";

/*
 * Vue
 */
import { computed, watch, onMounted } from "vue";

// * Models
import { TaskModelDefault, TaskModel } from "./todo-list.models";

// * Variables
const formData = ref<{ task: string; description: string }>({
  task: "",
  description: "",
});
const rows = ref<TaskModel[]>([]);
const selectedRow = ref<TaskModel>(TaskModelDefault);
const requestToServer = ref(""); // GET POST PUT DELETE
const show = ref(false);
const msn = ref("");
const type = ref("");
const search = ref("");

// * Mock Data
// [
//     {
//         done: false,
//         task: 'Otto',
//         description: 'Una descripcion cualquiera'
//     },
//     {
//         done: true,
//         task: 'Thornton',
//         description: 'Otra descripcion'
//     },
// ],

// * Computed
const title = computed(() => (selectedRow.value ? selectedRow.value.task : ""));
const description = computed({
  // getter
  get() {
    return selectedRow.value ? selectedRow.value.description : "";
  },
  // setter
  set(newVal) {
    return newVal;
  },
});
const searchFilter = computed(() =>
  rows.value.filter((curVal) => {
    return curVal.task.toLowerCase().match(search.value.toLowerCase());
  })
);

// * Watch
watch(rows, async (newVal /*, oldVal*/) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  requestToServer.value === "POST"
    ? // fetch('http://localhost:3000/Task', {
      fetch("/Task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: 'include',
        body: JSON.stringify(newVal[newVal.length - 1]),
      })
        .then((res) => res.json())
        .then((info) => {
          // Object is possibly 'undefined'.ts-plugin(2532) - Error (TS2532)
          newVal[newVal.length - 1]!._id = info._id;

          msn.value = "Your data has been created correctly";
          type.value = "success";
          if (!show.value) show.value = !show.value;
        })
        .catch((err) => console.log(err))
    : requestToServer.value === "DELETE"
    ? // fetch('http://localhost:3000/Task', {
      fetch("/Task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // credentials: 'include',
        body: JSON.stringify({
          _id: selectedRow.value._id,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          msn.value = info;
          type.value = "success";
          if (!show.value) show.value = !show.value;
        })
        .catch((err) => console.log(err))
    : requestToServer.value === "PUT"
    ? console.log("Llego aqui: ", selectedRow.value.done)
    : console.log("Datos cargados correctamente");
});

// * OnMounted
onMounted(() => {
  // fetch('http://localhost:3000/Task', {
  fetch("/Task", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // credentials: 'include'
  })
    .then((res) => res.json())
    .then((info) => {
      rows.value = info;

      requestToServer.value = "GET";
    })
    .catch((err) => console.log(err));
});

// * Methods
const addTask = (/*e: Event*/) => {
  /*
  if (!e.target) return;

  const task = e.target as HTMLFormElement [0],
    description = e.target as HTMLFormElement [1];
  */

  if (formData.value.task) {
    requestToServer.value = "POST";

    rows.value.push(
      new TaskModel({
        done: false,
        task: formData.value.task,
        description: formData.value.description,
      })
    );

    formData.value.task = "";
    formData.value.description = "";
  }
};

const updateTask = (task: TaskModel) => {
  const updateTask: HTMLSelectElement | null = document.querySelector("#updateTask");
  //task.task ->  La tarea a actualizar

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  updateTask!.checkValidity()
    ? // fetch('http://localhost:3000/Task', {
      fetch("/Task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // credentials: 'include',
        body: JSON.stringify({
          _id: task._id,
          task: task.task,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          msn.value = info;
          type.value = "success";
          if (!show.value) show.value = !show.value;
        })
        .catch((err) => console.log(err))
    : ((msn.value = updateTask!.validationMessage),
      (type.value = "danger"),
      // eslint-disable-next-line no-self-assign
      !show.value ? (show.value = !show.value) : (show.value = show.value));
};

const setRow = (row: TaskModel) => {
  selectedRow.value = row;
  // $refs.descriptionTask.$forceUpdate();
};

const deleteTask = () => {
  requestToServer.value = "DELETE";

  rows.value.splice(rows.value.indexOf(selectedRow.value), 1);
};

const updateTaskDescription = (newDescription: string) => {
  // fetch('http://localhost:3000/Task', {
  fetch("/Task", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // credentials: 'include',
    body: JSON.stringify({
      _id: selectedRow.value._id,
      description: newDescription,
    }),
  })
    .then((res) => res.json())
    .then((info) => {
      // Object is possibly 'undefined'.ts-plugin(2532) - Error (TS2532)
      rows.value[rows.value.indexOf(selectedRow.value)]!.description =
        newDescription;

      msn.value = info;
      type.value = "success";
      if (!show.value) show.value = !show.value;
    })
    .catch((err) => console.log(err));
};

const updateDone = () => {
  // fetch('http://localhost:3000/Task', {
  fetch("/Task", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // credentials: 'include',
    body: JSON.stringify({
      _id: selectedRow.value._id,
      done: selectedRow.value.done,
    }),
  })
    .then((res) => res.json())
    .then((info) => {
      msn.value = info;
      type.value = "success";
      if (!show.value) show.value = !show.value;
    })
    .catch((err) => console.log(err));
};
</script>

<style scoped>
table .taskDone {
  text-decoration: line-through;
}

form textarea {
  resize: none;
}

#searchIcon {
  background-image: url("/assets/search.svg");
  background-size: 20px 20px;
  /* background-size: contain; */
  background-position: 10px 7px;
  background-repeat: no-repeat;
  padding: 12px 20px 12px 40px;
}

@media (max-width: 576px) {
  form button.btn {
    width: 100%;
  }
}
</style>
