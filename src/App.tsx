import { Header } from './components/Header';
import { Todos } from './components/Todos';
import styles from './styles/App.module.css';

function App() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.content}>
        <Todos />
      </main>
    </div>
  );
}

export default App;
