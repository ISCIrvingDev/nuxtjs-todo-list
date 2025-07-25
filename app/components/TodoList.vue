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
                        <input type="text" id="task" class="form-control" minlength="5" maxlength="25" pattern="[A-Za-z]{2}[ _A-Za-z0-9]{1,22}" title="It has to start with two letters, have at least 5 characters and end with a letter or a number" placeholder="Task" required>

                        <textarea id="description" class="form-control mt-1 mt-sm-3" rows="3" placeholder="Description"></textarea>
                    </div>
                    
                    <div class="col-12 col-sm-2 mt-2 mt-sm-0">
                        <button type="submit" class="btn btn-outline-dark">Add</button>
                    </div>
                </div>
            </form>
        </section>

        <section>
            <input type="text" id="searchIcon" class="form-control" maxlength="25" placeholder="Search..." v-model="search">
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
                        <th scope="row">{{ (rows.indexOf(row) + 1) }}
                         </th>
                        <th scope="row"><a href="#" class="far fa-window-restore" data-toggle="modal" data-target="#descriptionModal" @click="setRow(row)"></a>
                         </th>
                        <td>
                            <div class="form-check">
                                <input class="form-check-input position-static" type="checkbox" v-model="row.done" @change="setRow(row); requestToServer = 'PUT'; updateDone();">
                            </div>
                        </td>
                        <td>
                            <input id="updateTask" class="rounded bg-text-silver bg-text-silver border-0" :class="{taskDone: row.done}" type="text" v-model="row.task" @keyup.enter="updateTask(row)" maxlength="25" pattern="[A-Za-z]{2}[ _A-Za-z0-9]{1,22}" title="It has to start with two letters, have at least 5 characters and end with a letter or a number" required>
                        </td>
                        <td>
                            <button type="button" class="btn btn-outline-danger" data-toggle="modal" data-target="#confirmModal" @click="setRow(row)">X</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

        <Alert :show="show" :msn="msn" :type="type" @fadeOut="show = !show"/>
        <ConfirmModal item="task" @done="deleteTask"/>
        <DescriptionModal :title="title" :description="description" @update="updateTaskDescription" ref="descriptionTask"/>
    </div>
</template>

<script>
    import ConfirmModal from './ConfirmModal.vue';
    import Alert from './Alert.vue';
    import DescriptionModal from './DescriptionModal.vue';

    export default {
        name: 'TodoList',
        components: {
            ConfirmModal,
            Alert,
            DescriptionModal
        },
        data() {
            return {
                rows: [],
                requestToServer: '',// GET POST PUT DELETE
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
                selectedRow: null,
                show: false,
                msn: '',
                type: '',
                search: ''
            }
        },
        created () {
            // fetch('http://localhost:3000/Task', {
            fetch('/Task', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                // credentials: 'include'
            })
                .then(res => res.json())
                .then(info => {
                    this.rows = info;

                    this.requestToServer = 'GET';
                })
                .catch(err => console.log(err));
        },
        watch: {
            rows: function (newVal, oldVal) {
                this.requestToServer === 'POST' ?
                    (
                        // fetch('http://localhost:3000/Task', {
                        fetch('/Task', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            // credentials: 'include',
                            body: JSON.stringify(newVal[newVal.length-1])
                        })
                            .then(res => res.json())
                            .then(info => {
                                newVal[newVal.length-1]._id = info._id;
                                
                                this.msn = 'Your data has been created correctly';
                                this.type = 'success';
                                if (!this.show) this.show = !this.show;
                            })
                            .catch(err => console.log(err))
                    ) :
                    (
                        this.requestToServer === 'DELETE' ?
                        (
                            // fetch('http://localhost:3000/Task', {
                            fetch('/Task', {
                                method: 'DELETE',
                                headers: {'Content-Type': 'application/json'},
                                // credentials: 'include',
                                body: JSON.stringify({
                                    _id: this.selectedRow._id
                                })
                            })
                                .then(res => res.json())
                                .then(info => {
                                    this.msn = info;
                                    this.type = 'success';
                                    if (!this.show) this.show = !this.show;
                                })
                                .catch(err => console.log(err))
                        ) :
                        (
                            this.requestToServer === 'PUT' ?
                            (
                                console.log('Llego aqui: ', this.selectedRow.done)
                            ) :
                            (
                                console.log('Datos cargados correctamente')
                            )
                        )
                    );
            }
        },
        computed: {
            title: function () {
                return this.selectedRow ? this.selectedRow.task : '';
            },
            description: {
                get () {
                    return this.selectedRow ? this.selectedRow.description : '';
                },
                set (newVal) {
                    return newVal;
                }
            },
            searchFilter: function () {
                return this.rows.filter(curVal => {
                    return curVal.task.toLowerCase().match(this.search.toLowerCase());
                })
            }
        },
        methods: {
            addTask (e) {
                let task = e.target[0],
                    description = e.target[1];

                if (task.value) {
                    this.requestToServer = 'POST';

                    this.rows.push({
                        done: false,
                        task: task.value,
                        description: description.value
                    });

                    task.value = '';
                    description.value = '';
                }
            },
            updateTask (task) {
                let updateTask = document.querySelector('#updateTask');
                //task.task ->  La tarea a actualizar

                updateTask.checkValidity() ?
                    (
                        // fetch('http://localhost:3000/Task', {
                        fetch('/Task', {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json'},
                            // credentials: 'include',
                            body: JSON.stringify({
                                _id: task._id,
                                task: task.task
                            })
                        })
                            .then(res => res.json())
                            .then(info => {
                                this.msn = info;
                                this.type = 'success';
                                if (!this.show) this.show = !this.show;
                            })
                            .catch(err => console.log(err))
                    ) :
                    (
                        this.msn = updateTask.validationMessage,
                        this.type = 'danger',
                        !this.show ? this.show = !this.show : this.show = this.show
                    );
            },
            setRow (row) {
                this.selectedRow = row;
                this.$refs.descriptionTask.$forceUpdate();
            },
            deleteTask () {
                this.requestToServer = 'DELETE';

                this.rows.splice(this.rows.indexOf(this.selectedRow), 1);
            },
            updateTaskDescription (newDescription) {
                // fetch('http://localhost:3000/Task', {
                fetch('/Task', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    // credentials: 'include',
                    body: JSON.stringify({
                        _id: this.selectedRow._id,
                        description: newDescription
                    })
                })
                    .then(res => res.json())
                    .then(info => {
                        this.rows[this.rows.indexOf(this.selectedRow)].description = newDescription;

                        this.msn = info;
                        this.type = 'success';
                        if (!this.show) this.show = !this.show;
                    })
                    .catch(err => console.log(err));
            },
            updateDone () {
                // fetch('http://localhost:3000/Task', {
                fetch('/Task', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    // credentials: 'include',
                    body: JSON.stringify({
                        _id: this.selectedRow._id,
                        done: this.selectedRow.done
                    })
                })
                    .then(res => res.json())
                    .then(info => {
                        this.msn = info;
                        this.type = 'success';
                        if (!this.show) this.show = !this.show;
                    })
                    .catch(err => console.log(err));
            }
        }
    }
</script>

<style scoped>
    table .taskDone {
        text-decoration: line-through;
    }

    form textarea {
        resize: none;
    }

    #searchIcon {
        background-image: url('../assets/search.svg');
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
