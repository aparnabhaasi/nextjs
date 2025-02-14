import PageTitle from '@/components/PageTitle'
import PropertyList from './components/ServiceList'
import PropertyStat from './components/ServiceStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Listing List' }

const PropertyListPage = () => {
  return (
    <>
      <PageTitle title="Service" subName="Service" />
      {/* <PropertyStat /> */}
      <PropertyList />
    </>
  )
}

export default PropertyListPage
