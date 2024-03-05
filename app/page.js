import IndexPage from "@/src/site_pages/IndexPage/IndexPage";
import { NecessaryProviders } from "@/src/context/providers";
import { dbAPI } from "@/src/lib/dbAPI";

const getData = async (sectionName) => {
  const resp = await dbAPI.getSectionDataOnIndexPage(sectionName);
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
    pricing = await getData('pricing');
  } catch (error) {
    console.error(error)
  }
  return (
    <NecessaryProviders >
      <IndexPage data={{ features, pricing }} />
    </NecessaryProviders>
  )
}
