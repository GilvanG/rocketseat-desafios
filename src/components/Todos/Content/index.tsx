import { ClipboardText } from 'phosphor-react';
import styles from './TodoContent.module.css';
import { ItemTodo } from '../ItemTodo';
import { ITask } from '../task';

export interface IListContentProps {
  tasks: ITask[];
  onDelete: (taskId: string) => void;
  onSelect: (taskId: string) => void;
}

export function TodoContent({ tasks, onDelete, onSelect }: IListContentProps) {
  const createdTasksCount = tasks.length;
  const doneTasksCount = tasks.filter((task: ITask) => task.isDone).length;

  return (
    <div className={styles.listContent}>
      <div className={styles.listContentHeader}>
        <div className={styles.listCreatedTaskCounter}>
          Tarefas Criadas
          <span>{createdTasksCount}</span>
        </div>
        <div className={styles.listDoneTaskCounter}>
          Concluídas
          <span>
            {doneTasksCount} de {createdTasksCount}
          </span>
        </div>
      </div>
      {tasks.length === 0 ? (
        <div className={styles.emptyList}>
          <ClipboardText size={72} />
          <strong>Você ainda não tem tarefas cadastradas.</strong>
          <p>Crie tarefas e organize seus itens a fazer</p>
        </div>
      ) : (
        <main className={styles.listItensContainer}>
          {tasks.map(({ content, id, isDone }: ITask) => (
            <ItemTodo
              id={id}
              isDone={isDone}
              content={content}
              onSelect={onSelect}
              onDelete={onDelete}
              key={`${id}-${content}`}
            />
          ))}
        </main>
      )}
    </div>
  );
}
