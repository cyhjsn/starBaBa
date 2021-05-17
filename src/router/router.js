const MainRouets = [
  {
    path: '/home',
    alias: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/shopbag',
    name: 'Shopbag',
    component: () => import('../views/Shopbag.vue')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/My.vue')
  }
];

export const routes = [
    {
      path: '/',
      name: 'Main',
      component: () => import('../views/Main.vue'),
      //二级路由
      children: MainRouets
    },
    {
      path: '/login', 
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/detail/:pid',
      name: 'Detail',
      component: () => import('../views/Detail.vue')
    },
    {
      path: '/pay/',
      name: 'Pay',
      component: ()=> import('../views/Pay.vue')
    },
    {
      path: '/newAddress/:aid?',
      name: 'NewAddress',
      component: ()=> import('../views/NewAddress.vue')
    },
    {
      path: '/addressList/',
      name: 'AddressList',
      component: ()=> import('../views/AddressList.vue')
    },
    {
      path: '/order/',
      name: 'Order',
      component: ()=> import('../views/Order.vue')
    },
    {
      path: '/account/',
      name: 'Account',
      component: ()=> import('../views/Account.vue')
    },
    {
      path: '/like/',
      name: 'Like',
      component: ()=> import('../views/Like.vue')
    },
    {
      path: '/secure/',
      name: 'Secure',
      component: ()=> import('../views/Secure.vue')
    }
  ]