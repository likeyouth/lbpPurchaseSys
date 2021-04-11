import Home from '@/pages/Home';
import BasicLayout from '@/pages/layout';
import Login from '@/pages/Login';

// 部门负责人
import GoodsList from '@/pages/department/GoodList';
import ApplyList from '@/pages/department/ApplyList';

const routerConfig = [
  {
    path: '/login',
    component: Login,
    exact: true
  },
  {
    path: '/',
    component: BasicLayout,
    exact: false,
    children: [
      {
        path: '/',
        component: Home,
        exact: true
      },
      // 部门负责人路由
      {
        path: '/department/goods',
        component: GoodsList,
        exact: true
      },
      {
        path: '/department/apply',
        component: ApplyList,
        exact: true
      }
    ]
  }
];

export default routerConfig;
