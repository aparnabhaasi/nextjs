import PageTitle from '@/components/PageTitle'
import BlogList from './components/BlogList'
import PropertyStat from './components/BlogStat'
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
