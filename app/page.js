
import { NecessaryProviders } from '@/src/context/providers';
import styles from './page.module.css';
import Login from '@/src/components/Login/Login';

export default async function Home() {

  return (
    <div className={styles.mainOuterContainer}>
      <NecessaryProviders>
        <Login />
      </NecessaryProviders>


    </div>
  )
}
