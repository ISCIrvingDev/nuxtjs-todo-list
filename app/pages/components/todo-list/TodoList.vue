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
            <th scope="col" class="col-1">#</th>
            <th scope="col" class="col-2">Details</th>
            <th scope="col" class="col-2">Done</th>
            <th scope="col" class="col-5">Task</th>
            <th scope="col" class="col-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, index) in searchFilter" :key="index">
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
                class="rounded border-0"
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
// * Nota: No es necesario importar los componentes, Nuxt lo hace de manera automatica
// import ConfirmModal from "./ConfirmModal.vue";
// import Alert from "./Alert.vue";
// import DescriptionModal from "./DescriptionModal.vue";

/*
 * Vue
 */
import { computed, onMounted } from "vue";

// * Models
import { TaskModelDefault, TaskModel } from "./todo-list.models";

// * Variables de entorno
const env = useRuntimeConfig();
const apiUrl = env.public.apiUrl;

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

// * OnMounted
onMounted(() => {
  fetch(`${apiUrl}/api/task`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // credentials: 'include'
  })
    .then((res) => res.json())
    .then((info) => {
      rows.value = info.data;

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
    const newVal = new TaskModel({
      task: formData.value.task,
      description: formData.value.description,
      done: false,
    });

    delete newVal._id;

    // fetch('http://base-url/api/task', {
    fetch(`${apiUrl}/api/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials: 'include',
      body: JSON.stringify(newVal),
    })
      .then((res) => res.json())
      .then((info) => {
        newVal._id = info.data._id;

        rows.value.push(newVal);

        formData.value.task = "";
        formData.value.description = "";

        msn.value = "Your data has been created correctly";
        type.value = "success";
        if (!show.value) show.value = !show.value;
      })
      .catch((err) => console.log(err));
  }
};

const updateTask = (task: TaskModel) => {
  const updateTask: HTMLSelectElement | null =
    document.querySelector("#updateTask");
  //task.task ->  La tarea a actualizar

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  updateTask!.checkValidity()
    ? fetch(`${apiUrl}/api/task/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // credentials: 'include',
        body: JSON.stringify({
          task: task.task,
        }),
      })
        .then((res) => res.json())
        .then((info) => {
          msn.value = `Task successfully updated: ${info.data._id}`;
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

  fetch(`${apiUrl}/api/task/${selectedRow.value._id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    // credentials: 'include',
  })
    .then((res) => res.json())
    .then((info) => {
      rows.value.splice(rows.value.indexOf(selectedRow.value), 1);

      msn.value = `Task successfully eliminated: ${info.data._id}`;
      type.value = "success";

      if (!show.value) show.value = !show.value;
    })
    .catch((err) => console.log(err));
};

const updateTaskDescription = (newDescription: string) => {
  fetch(`${apiUrl}/api/task/${selectedRow.value._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // credentials: 'include',
    body: JSON.stringify({
      description: newDescription,
    }),
  })
    .then((res) => res.json())
    .then((info) => {
      // Object is possibly 'undefined'.ts-plugin(2532) - Error (TS2532)
      rows.value[rows.value.indexOf(selectedRow.value)]!.description =
        newDescription;

      msn.value = `Task successfully updated: ${info.data._id}`;
      type.value = "success";
      if (!show.value) show.value = !show.value;
    })
    .catch((err) => console.log(err));
};

const updateDone = () => {
  fetch(`${apiUrl}/api/task/${selectedRow.value._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // credentials: 'include',
    body: JSON.stringify({
      done: selectedRow.value.done,
    }),
  })
    .then((res) => res.json())
    .then((info) => {
      msn.value = `Task successfully updated: ${info.data._id}`;
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
