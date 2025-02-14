import PageTitle from '@/components/PageTitle'
import PropertyList from './components/KeywordList'
import PropertyStat from './components/KeywordStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Keyword' }

const PropertyListPage = () => {
  return (
    <>
      <PageTitle title="Keyword" subName="Our Keyword" />
      {/* <PropertyStat /> */}
      <PropertyList />
    </>
  )
}

export default PropertyListPage
