// Modelo del "Task"
export class TaskModel {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean = true;
  done: boolean = false;
  task: string = "";
  description: string = "";

  constructor(init?: Partial<TaskModel>) {
    Object.assign(this, init);
  }
}

export const TaskModelDefault: TaskModel = {
  _id: "",
  createdAt: "",
  updatedAt: "",
  active: true,
  done: false,
  task: "",
  description: "",
};
