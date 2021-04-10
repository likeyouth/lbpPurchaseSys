import Home from '@/pages/Home';
import Login from '@/pages/Login';

const routerConfig = [
  {
    path: '/login',
    component: Login,
    exact: true
  },
  // {
  //   path: '/',
  //   component: BasicLayout,
  //   exact: false,
  //   children: [
  //     {
  //       path: '/',
  //       component: Home,
  //       exact: true
  //     }
  //   ]
  // }
];

export default routerConfig;
