import PageTitle from '@/components/PageTitle'
import PropertyList from './components/ContactList'
import PropertyStat from './components/ContactStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Listing List' }

const PropertyListPage = () => {
  return (
    <>
      <PageTitle title="Contact" subName="Contact us" />
      {/* <PropertyStat /> */}
      <PropertyList />
    </>
  )
}

export default PropertyListPage
