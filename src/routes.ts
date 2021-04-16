import Home from '@/pages/Home';
import BasicLayout from '@/pages/layout';
import Login from '@/pages/Login';

// 部门负责人
import GoodsList from '@/pages/department/GoodList';
import ApplyList from '@/pages/department/ApplyList';

// 库存管理员
import OrderForm from '@/pages/storage/OrderForm';
import GoodsManage from '@/pages/storage/GoodsManage';

// 系统管理员
import Order from '@/pages/admin/OrderForm';
import UserManage from '@/pages/admin/UserManage';
import OrderDetail from '@/pages/admin/OrderDetail';

// 采购员
import Supplier from '@/pages/buyer/Supplier';
import ApprovalList from '@/pages/buyer/ApprovalList';
import OrderManage from '@/pages/buyer/OrderForm';
import Plane from '@/pages//buyer/Plane';
import PlaneDetail from '@/pages/buyer/Plane/PlaneDetail';
import SupplierStatistic from '@/pages/buyer/Statistics/Supplier';

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
      },
      // 库存管理员路由
      {
        path: '/storage/orderForm',
        component: OrderForm,
        exact: true
      },
      {
        path: '/storage/goodsManage',
        component: GoodsManage,
        exact: true
      },
      // 系统管理员路由
      {
        path: '/admin/orderForm',
        component: Order,
        exact: true
      },
      {
        path: '/admin/userManage',
        component: UserManage,
        exact: true
      },
      {
        path: '/admin/orderTail',
        component: OrderDetail,
        exact: true
      },
      // 采购员
      {
        path: '/buyer/supplier',
        component: Supplier,
        exact: true
      },
      {
        path: '/buyer/approvalList',
        component: ApprovalList,
        exact: true
      },
      {
        path: '/buyer/orderManage',
        component: OrderManage,
        exact: true
      },
      {
        path: '/buyer/plane',
        component: Plane,
        exact: true
      },
      {
        path: '/buyer/planeDetail',
        component: PlaneDetail,
        exact: true
      },
      {
        path: '/buyer/supplierStatistic',
        component: SupplierStatistic,
        exact: true
      }
    ]
  }
];

export default routerConfig;
