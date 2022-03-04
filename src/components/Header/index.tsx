import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styles.container}>
      <Link href="/">
        <a>
          <span className={styles.contentLogo}>
            <img className={styles.logo} src="/Logo.svg" alt="logo" />
          </span>
        </a>
      </Link>
    </div>
  );
}
