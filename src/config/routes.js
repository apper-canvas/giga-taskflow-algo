import HomePage from '@/components/pages/HomePage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  notFound: { // Add NotFound to routes if needed for dynamic routing
    id: 'not-found',
    label: 'Not Found',
    path: '*',
    component: NotFoundPage
  }
}

export const routeArray = Object.values(routes)