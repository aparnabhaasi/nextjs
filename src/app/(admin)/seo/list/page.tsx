import PageTitle from '@/components/PageTitle'
import SeoList from './components/SeoList'
import PropertyStat from './components/SeoStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Seo' }

const SeoListPage = () => {
  return (
    <>
      <PageTitle title="Seo" subName="Our Seo" />
      {/* <PropertyStat /> */}
      <SeoList />
    </>
  )
}

export default SeoListPage
