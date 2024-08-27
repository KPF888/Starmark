import { createHashRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import App from '../App';
const SubDomain = lazy(() => import('@renderer/src/page/subdomain/index.jsx'));
const UrlUtils = lazy(() => import('@renderer/src/page/urlutils/index.jsx'));
const UserConfig = lazy(() => import('@renderer/src/page/userConfig/index.jsx'));
const SubDomainList = lazy(
  () => import('@renderer/src/page/subdomain/childWindow/SubDomainList.jsx')
);

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/subdomain" replace={true} />
      },
      {
        path: '/subdomain',
        element: <SubDomain />
      },
      {
        path: '/urlUtils',
        element: <UrlUtils />
      },
      {
        path: '/userConfig',
        element: <UserConfig />
      }
    ]
  },
  {
    path: '/subdomain/list',
    element: <SubDomainList />
  }
]);

export default router;
