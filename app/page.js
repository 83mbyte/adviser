
import { getData } from '@/src/lib/fetchData';
import AppClient from '../src/components/AppClient';

import styles from './page.module.css';

export default async function Home() {

  const empty = {};
  const chatHistoryObj = await getData();;

  return (
    <div className={styles.mainOuterContainer}>
      {
        chatHistoryObj.status === 'success' ? <AppClient chatHistoryObj={chatHistoryObj.data} /> : <AppClient chatHistoryObj={empty} />
      }
    </div>
  )
}
