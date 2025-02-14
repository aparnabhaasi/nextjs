import PageTitle from '@/components/PageTitle'
import PropertyList from './components/SliderList'
import PropertyStat from './components/SliderStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Listing List' }

const PropertyListPage = () => {
  return (
    <>
      <PageTitle title="Slider" subName="Slider" />
      {/* <PropertyStat /> */}
      <PropertyList />
    </>
  )
}

export default PropertyListPage
