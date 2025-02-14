import PageTitle from '@/components/PageTitle'
import BlogList from './components/AboutList'
import PropertyStat from './components/AboutStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Listing List' }

const BlogListPage = () => {
  return (
    <>
      <PageTitle title="Service" subName="Service" />
      {/* <PropertyStat /> */}
      <BlogList />
    </>
  )
}

export default BlogListPage
