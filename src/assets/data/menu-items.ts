import { MenuItemType } from '@/types/menu'

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    url: '/dashboards/analytics',
    icon: 'ri:dashboard-2-line',
     
  },
    
  {
    key: 'property',
    label: 'Services',
    url: '/servicess/list',
    icon: 'ri:community-line',
     
  },
  {
    key: 'property',
    label: 'Courses',
    url: '/courses/list',
    icon: 'ri:community-line',
     
  },
  {
    key: 'property',
    label: 'Blog',  
    url: '/blog/list',
    icon: 'ri:community-line',
     
  },
   
    
  {
    key: 'property',
    label: 'SEO',
    url: '/seo/list',
    icon: 'ri:community-line',
     
  },
  {
    key: 'property',
    label: 'Keyword',
    url: '/keyword/list',
    icon: 'ri:community-line',
     
  },  
    
]
