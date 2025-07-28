// Modelo del "Task"
export class TaskModel {
  public id: number = 0;
  _id: string = "";
  createdAt: string = "";
  updatedAt: string = "";
  active: boolean = true;
  done: boolean = false;
  task: string = "";
  description: string = "";

  constructor(init?: Partial<TaskModel>) {
    Object.assign(this, init);
  }
}

export const TaskModelDefault: TaskModel = {
  id: 0,
  _id: "",
  createdAt: "",
  updatedAt: "",
  active: true,
  done: false,
  task: "",
  description: "",
};
