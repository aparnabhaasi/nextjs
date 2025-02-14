import PageTitle from '@/components/PageTitle'
import PropertyList from './components/CourseList'
import PropertyStat from './components/CourseStat'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Courses' }

const PropertyListPage = () => {
  return (
    <>
      <PageTitle title="Courses" subName="Our Courses" />
      {/* <PropertyStat /> */}
      <PropertyList />
    </>
  )
}

export default PropertyListPage
