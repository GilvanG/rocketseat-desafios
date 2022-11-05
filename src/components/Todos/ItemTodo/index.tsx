import { Check, Trash } from 'phosphor-react';
import styles from './ItemTodo.module.css';
import { IListItemProps } from '../task';

export function ItemTodo({
  content,
  id,
  isDone,
  onDelete,
  onSelect,
}: IListItemProps) {
  function handleDeleteTask() {
    onDelete(id);
  }

  function handleSelectTask() {
    onSelect(id);
  }

  return (
    <div className={styles.listItem}>
      <button
        className={
          isDone ? styles.listItemToggleSelected : styles.listItemToggle
        }
        onClick={handleSelectTask}
      >
        {isDone ? <Check size={24} /> : null}
      </button>
      <p className={isDone ? styles.listItemTextSelected : styles.listItemText}>
        {content}
      </p>
      <button
        className={styles.listItemDeleteButton}
        onClick={handleDeleteTask}
      >
        <Trash size={24} />
      </button>
    </div>
  );
}
