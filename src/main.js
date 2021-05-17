import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'

import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'

import VueCookies from 'vue-cookies'

//导入vant组件
import { 
  NavBar,
  Field,
  Button,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Checkbox,
  SwipeCell,
  SubmitBar,
  List,
  Empty,
  AddressList,
  AddressEdit,
  Icon,
  Tab,
  Tabs,
  Uploader,
  Cell,
  Dialog,
  Sidebar,
  SidebarItem,
  Form 
} from 'vant'

//注册
Vue
  .use(NavBar)
  .use(Field)
  .use(Button)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Checkbox)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(List)
  .use(Empty)
  .use(AddressList)
  .use(AddressEdit)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  .use(Cell)
  .use(Dialog)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Form)

axios.interceptors.request.use(config => {
  // 
  if(config.method === 'post'){
    let paramsString = '';
    for(let key in config.data){
      // 
      paramsString += `${key}=${config.data[key]}&`
      // 
    }
    config.data = paramsString.slice(0, -1);
    
  }

  return config;
})





Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.config.productionTip = false

Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002'
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='


Vue.filter('decimal',(v , n = 2)=>{
  return v.toFixed(n);
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
