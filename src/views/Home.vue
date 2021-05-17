<template>
  <div class="home">
    <van-nav-bar>
      <template #left>
        <div class="home-logo">
          <img class="auto-img" src="../assets/images/logo.png">
        </div>
      </template>
      <template #right>
        <span class="app_name">StarBaBa</span>
      </template>
    </van-nav-bar>

    <van-swipe @change="changeCurrentIndex" :autoplay="3000">

      <van-swipe-item v-for="(item, index) in bannerData" :key="index">
        <img class="auto-img" :src="item.bannerImg" alt="">
      </van-swipe-item>

      <template #indicator>
          <div class="indicator-box">
            <div class="indicator-item" :class="{active: currentIndex == i}" v-for="(v, i) in bannerData.length" :key="i"></div>
          </div>
      </template>
    </van-swipe>



    <!-- 登录状态 -->
    <div class="login-state">
      <div class="noLogin" v-if="!isLogin">
        <div class="lgst-left">您还未登录,请先登录</div>
        <div class="lgst-right"><van-button round type="info" color="#106e33" @click="goLogin()">登录/注册</van-button></div>
      </div>
      <div class="haveLogin" v-else>
        <div class="haveLogin-left">
          <img class="auto-img" :src="userInfo.userImg" alt="">
        </div>
        <div class="haveLogin-right">你好，欢迎您，<span class="user-name">{{userInfo.nickName}}</span></div>
      </div>
    </div>

    <div class="product-box">
      <div class="line">
        <span>热卖推荐</span>
      </div>
      <div class="product-items">
        <Product class="product-item" v-for="(item, index) in hotProduct" :key="index" :product="item">
          <template #hot>
            <div class="hot-box">hot</div>
          </template>
        </Product>
      </div>
    </div>

  </div>
</template>

<script>

import '../assets/less/home.less' 
import Product from '../components/Product'
export default {
  name: 'Home',
  data(){
    return {
      currentIndex:0,
      bannerData: [],
      hotProduct:[],
      userInfo: {},
      isLogin:false
    }
  },
  created(){
    this.getBannerData();
    this.getHotProduct();
    this.getUserInfo();
  },
  components:{
    Product
  },
  methods:{
    
    changeCurrentIndex(index){
      this.currentIndex = index;
    },
    getBannerData(){
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: 'GET',
        url: this.baseUrl + '/banner',
        params:{
          appkey: this.appkey
        }
      }).then(res => {
        this.$toast.clear();
        if(res.data.code === 300){
          this.bannerData = res.data.result;
        }else{
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
          })
        }
      }).catch(err => {
          this.$toast.clear();
          
      })
    },
    getHotProduct(){
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: 'GET',
        url: this.baseUrl + '/typeProducts',
        params:{
          appkey: this.appkey,
          key:'isHot',
          value:1
        }
      }).then(res => {
        
        this.$toast.clear();

        if(res.data.code === 500){
          this.hotProduct = res.data.result;
        }else{
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
          })
        }
      }).catch(err => {
        this.$toast.clear();
        
      })
    },
    //获取用户信息
    getUserInfo() {
      
      let tokenString = this.$cookies.get("tokenString");
      
      if (!tokenString) {
        
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          
          this.$toast.clear();


          if (res.data.code === "A001") {
            this.userInfo = res.data.result[0];
            this.isLogin = true;
          } 
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查看商品详情
    viewProduct(pid) {
      this.$router.push({name: 'Detail', params: {pid}});
    },
    goLogin(){
            this.$router.push({name: 'Login'})
        }
  }
}
</script>

