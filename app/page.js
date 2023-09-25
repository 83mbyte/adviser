
import { NecessaryProviders } from '@/src/context/providers';
import styles from './page.module.css';
import IndexPage from '@/src/components/IndexPage/IndexPage';
import { dbAPI } from '@/src/lib/dbAPI';


const getData = async (sectionName) => {
  const resp = await dbAPI.getSectionData(sectionName);
  if (!resp) {
    throw new Error('Failed to fetch data')
  }
  return resp
}



export default async function Home() {
  let features;
  let pricing;
  try {
    features = await getData('features');
    pricing = await getData('pricing')
  } catch (error) {
    console.error(error)
  }

  return (
    <div className={styles.mainOuterContainer}>
      <NecessaryProviders>
        <IndexPage data={{ features, pricing }} />
      </NecessaryProviders>


    </div>
  )
}
