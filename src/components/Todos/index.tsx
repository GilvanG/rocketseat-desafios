import { FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle } from 'phosphor-react';
import styles from './Todos.module.css';
import { ITask, tasksRaw } from './task';
import { TodoContent } from './Content';

export function Todos() {
  const [tasks, setTasks] = useState<ITask[]>(tasksRaw);
  const [newTaskText, setNewTaskText] = useState<string>('');
  function compareOrderTask(taskA: ITask, taskB: ITask): number {
    let taskANormalized = taskA.content.toUpperCase(),
      taskBNormalized = taskB.content.toUpperCase();
    return taskANormalized === taskBNormalized
      ? 0
      : taskANormalized > taskBNormalized
      ? 1
      : -1;
  }
  function sortIsDone(newTasksArray: ITask[]) {
    const newTasksArraySorted = newTasksArray.sort((taskA, taskB) => {
      if (!taskA.isDone) {
        if (!taskB.isDone) {
          return compareOrderTask(taskA, taskB);
        }
        return -1;
      } else if (taskB.isDone) {
        return compareOrderTask(taskA, taskB);
      }

      return 1;
    });
    return newTasksArraySorted;
  }

  function handleContentInvalid(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity('Esse campo é obrigatório!');
  }

  function handleNewTaskText(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.setCustomValidity('');
    setNewTaskText(event.target.value);
  }

  function handleCreateNewTask(event: FormEvent) {
    event.preventDefault();
    const newTask = {
      content: newTaskText,
      id: uuidv4(),
      isDone: false,
    };

    setTasks(sortIsDone([...tasks, newTask]));
    setNewTaskText('');
  }

  function deleteTask(taskId: string) {
    const newTasksArray = tasks.filter((task: ITask) => task.id !== taskId);
    setTasks(newTasksArray);
  }

  function selectTask(taskId: string) {
    const newTasksArray = tasks.map((task: ITask) => {
      if (task.id === taskId) {
        task.isDone = !task.isDone;
      }
      return task;
    });
    setTasks(sortIsDone(newTasksArray));
  }

  return (
    <div className={styles.list}>
      <div className={styles.listHeader}>
        <form onSubmit={handleCreateNewTask}>
          <input
            type='text'
            id='newTask'
            placeholder='Adicione uma nova Tarefa'
            value={newTaskText}
            required
            onInvalid={handleContentInvalid}
            onChange={(e) => handleNewTaskText(e)}
            className={styles.listInputNewTask}
          />
          <button type='submit' className={styles.listButtonNewTask}>
            Criar <PlusCircle size={20} />
          </button>
        </form>
      </div>
      <TodoContent onDelete={deleteTask} onSelect={selectTask} tasks={tasks} />
    </div>
  );
}
