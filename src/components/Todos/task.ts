import { v4 as uuidv4 } from 'uuid';

export interface ITask {
  content: string;
  id: string;
  isDone: boolean;
}
export const tasksRaw: ITask[] = [
  {
    id: uuidv4(),
    isDone: false,
    content: 'Fazer desafio',
  },
  {
    id: uuidv4(),
    isDone: true,
    content: 'Estudar React',
  },
];
export interface IListItemProps extends ITask {
  onDelete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
}
