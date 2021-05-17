<template>
    <div class="login">
        <Nav />
        <div class="lg-bg">
           <div class="bg-left"><img class="auto-img" src="../assets/images/logo.png"></div>
           <div class="bg-right">StarBaBa</div>
        </div>
        <div class="lg-box">
            <div class="from-box">
                <van-field class="xinxi" v-model="userLoginInfo.phone" label="手机号" placeholder="输入手机号"/>
                <van-field class="xinxi" v-model="userLoginInfo.password" :type="isOutText ? 'text' : 'password'" label="密码" placeholder="输入密码" 
                :right-icon="isOutText ? 'eye-o' : 'closed-eye'" @click-right-icon="outToggleType"/>

                <div class="forgot"><span>忘记密码？</span></div>

                <div class="btn-box">
                    <van-button class="lg-btn" block color="#106e33" @click="login">登&nbsp;&nbsp;&nbsp;录</van-button>
                    <van-button class="register-btn" type="default" block @click="showPopup">注&nbsp;&nbsp;&nbsp;册</van-button>
                </div>
            </div>
        </div>
        
        <!-- 注册弹出层 -->
        <van-popup v-model="isShow" position="bottom" closeable>
            <div class="rg-box">
                <div class="rg-title">注册</div>
                <div class="from-box">
                    <van-field v-model="userRegisterInfo.phone" label="手机号" placeholder="输入手机号"/>
                    <van-field v-model="userRegisterInfo.password" :type="isInText ? 'text' : 'password'" label="密码" placeholder="输入密码" :right-icon="isInText ? 'eye-o' : 'closed-eye'" @click-right-icon="InToggleType"/> 
                    <van-field v-model="userRegisterInfo.nickName" label="昵称" placeholder="输入昵称(1-10位)"/> 
                    <div class="btn-box">
                        <van-button block color="#106e33" @click="register">注&nbsp;&nbsp;&nbsp;测</van-button>
                    </div>
                </div>
            </div>
        </van-popup>


    </div>
</template>

<script>
import "../assets/less/login.less";
import Nav from "../components/Nav" 
import {utils} from '../assets/js/utils'
export default {
  name: "Login",
  data(){
      return {
          userLoginInfo:{
              phone:'',
              password:'',
              
          },
          userRegisterInfo:{
              phone:'',
              password:'',
              nickName:''
          },
          isShow: false,
          isOutText:false,
          isInText:false
      }
  },
  methods:{
        showPopup(){
            this.isShow = true;
        },
        register(){
            let o = {
                phone: {
                    value: this.userRegisterInfo.phone,
                    reg: /^1[3-9]\d{9}$/,
                    errorMsg: '手机号码格式错误'
                },
                password:{
                    value: this.userRegisterInfo.password,
                    reg: /^[A-Za-z]\w{5,15}$/,
                    errorMsg: '密码只支持以字母开头的数字字母_组合'
                },
                nickName:{
                    value: this.userRegisterInfo.nickName,
                    reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
                    errorMsg: '昵称只支持汉字字母数字组合'
                },
            };
            if (!utils.validForm(o)) {
                return;
            }

            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            })

            this.axios({
                method: 'POST',
                url: this.baseUrl + '/register',
                data:{
                    appkey: this.appkey,
                    nickName: this.userRegisterInfo.nickName,
                    password: this.userRegisterInfo.password,
                    phone: this.userRegisterInfo.phone
                }
            }).then(res => {
                
                this.$toast.clear();
                if(res.data.code == 100){
                    this.isShow = false;
                    for(let key in this.userRegisterInfo){
                        this.userRegisterInfo[key] = '';
                    }
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
        login(){
            let o = {
                phone: {
                value: this.userLoginInfo.phone,
                reg: /^1[3-9]\d{9}$/,
                errorMsg: '手机号格式不正确'
                },

                password: {
                value: this.userLoginInfo.password,
                reg: /^[A-Za-z]\w{5,15}$/,
                errorMsg: '密码支持字母数字_组合且首字符必须为字母'
                }
            };
            if (!utils.validForm(o)) {
                return;
            }
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            });

            this.axios({
                method:'POST',
                url: this.baseUrl + '/login',
                data:{
                    appkey: this.appkey,
                    password: this.userLoginInfo.password,
                    phone: this.userLoginInfo.phone
                }
            }).then(res => {
                this.$toast.clear();
                if(res.data.code === 200){
                    this.$cookies.set('tokenString', res.data.token, '1d');
                    this.$router.push({name: 'Home'});
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000
                    })
                }
            }).catch(err =>{
                this.$toast.clear();
                
            })
        },
        outToggleType() {
            this.isOutText = !this.isOutText;
        },
        InToggleType() {
            this.isInText = !this.isInText;
        }
  },
  components:{
      Nav
  }
};
</script>

