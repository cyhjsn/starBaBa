<template>
    <div class="pay">
       <van-nav-bar title="支付订单" left-text="返回" left-arrow @click-left="back" />
       <div class="p-box">
           <div class="select-address">
               <div class="cc" @click="showSelectAddressList">选择地址<van-icon class="arrow" name="arrow"/></div>
               <div class="u-box">
                   <div class="u-info">
                       <div class="u-name">{{currentAddress.name}}</div>
                       <div class="u-phone">{{currentAddress.tel}} </div>
                   </div>
                   <div class="address">{{currentAddress.address}}</div>
               </div>
           </div>
           <div class="pro-box">
               <div class="title">订单详情</div>
               <div class="content">
                   <div v-for="(item, index) in payShopbagData" :key="index">
                            <div class="pro-box-o">
                                <div class="fl pro-img">
                                    <img class="auto-img" :src="item.small_img">
                                </div>
                                <div class="fl pro-info">
                                    <div class="p-i-text">
                                        <div class="clearfix">
                                            <div class="fl cn-name">{{item.name}}</div>
                                            <div class="fl p-rule">{{item.rule}}</div>
                                        </div>
                                        <div class="en-name">{{item.enname}}</div>
                                    </div>
                                    <div class="p-c-box">
                                         <div class="fl pro-price">&yen;{{item.price}}</div>
                                         <div class="fr number">
                                             x{{item.count}}
                                         </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                   <div>
                    </div>
               </div>
               <div class="clearfix bottom-content">
                        <div class="fl">共计 {{proInfo.count}} 件</div>
                        <div class="fr total">合计&yen;{{proInfo.total | decimal}}</div>
                    </div>  
           </div>
       </div>

       <van-popup is-link position="bottom" v-model="isClick" closeable>
           <div class="ar-title">选择地址</div>
           <van-address-list
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="add"
            @select="selectAddress"
            />
       </van-popup>


        <div class="pay-button">
            <van-button block @click="payTip" color="linear-gradient(to right, #2fb35f, #106e33)">
            立即结算
            </van-button>
        </div>


    </div>
</template>

<script>
import '../assets/less/pay.less'
import {mapState, mapMutations} from 'vuex';
    export default {
        name: 'Pay',
        data(){
            return {
                isClick:false,
                chosenAddressId: '',
                list: [],
                currentAddress:{},
                sids:[],
                payShopbagData:[],
                proInfo: {
                    count: 0,
                    total: 0
                }
            }
        },
        computed: {
            ...mapState(['shopbagCount'])
        },
        created(){

            this.sids = this.$route.query.sids.split('-');
            

            this.getAddressListData(); 

            this.getShopbagDataByPay();
        },
        methods:{
            ...mapMutations(['changeShopbagCount']),
            back() {
                this.$router.go(-1);
            },

            add() {
            this.$router.push({name: 'NewAddress'});
            },

            selectAddress(item,index){
                this.isClick = false;

                this.currentAddress = item;
            },

            showSelectAddressList(){
                this.isClick = true;
            },

            getAddressListData() {
            let tokenString = this.$cookies.get("tokenString");

            if (!tokenString) {
                
                return this.$router.push({ name: "Login" });
            }
            
            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });

            this.axios({
                //请求方式
                method: "GET",
                url: this.baseUrl + "/findAddress",
                params: {
                appkey: this.appkey,
                tokenString
                }
            })
                .then((res) => {
                
                this.$toast.clear();

                if (res.data.code == 700) {
                    this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 3000,
                    });
                    return this.$router.push({ name: "Login" });
                }

                if (res.data.code === 20000) {
                    //添加address属性
                    res.data.result.forEach(v => {
                    v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
                    v.isDefault = Boolean(v.isDefault);

                    if(v.isDefault){
                        this.chosenAddressId = v.id;
                        this.currentAddress = v; 
                    }
                    })
 
                    this.list = res.data.result;
                } else {
                    this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 3000,
                    });
                }
                
                })
                .catch((err) => {
                this.$toast.clear();
                
                });
            },

            getShopbagDataByPay() {
                let tokenString = this.$cookies.get("tokenString");

                if (!tokenString) {
                    
                    return this.$router.push({ name: "Login" });
                }
                
                this.$toast.loading({
                    message: "加载中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    //请求方式
                    method: "GET",
                    url: this.baseUrl + "/commitShopcart",
                    params: {
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(this.sids)
                    }
                }) .then((res) => {
                    
                    this.$toast.clear();

                    if (res.data.code == 700) {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                        return this.$router.push({ name: "Login" });
                    }

                    if (res.data.code === 50000) {

                        if (res.data.result.length === 0) {
                        return this.$router.push({path: '/'});
                        }

                        res.data.result.forEach(v => {
                        this.proInfo.count += v.count;
                        this.proInfo.total += v.count * v.price;
                        })

                        this.payShopbagData = res.data.result;
                        // 
                    } else {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                    }
                    })
                    .catch((err) => {
                    this.$toast.clear();
                    
                    });
            },

            payTip(){
                this.$dialog.confirm({
                    title: '确认订单 ',
                    message: '是否立即结算？',
                    confirmButtonColor: '#106e33'
                }).then(() =>{
                    this.pay();
                }).catch(err => {
                    
                })
            },

            pay() {

                if (!this.currentAddress.aid) {
                    return this.$toast({
                    message: "选择收货地址",
                    forbidClick: true,
                    duration: 3000,
                    });
                }

                let tokenString = this.$cookies.get("tokenString");

                if (!tokenString) {
                    
                    return this.$router.push({ name: "Login" });
                }
                let data = {
                    appkey: this.appkey,
                    tokenString,
                    sids: JSON.stringify(this.sids),
                    phone: this.currentAddress.tel,
                    address: this.currentAddress.address,
                    receiver: this.currentAddress.name
                };

                this.axios({
                    //请求方式
                    method: "POST",
                    url: this.baseUrl + "/pay",
                    data
                })
                    .then((res) => {
                    
                    this.$toast.clear();

                    if (res.data.code == 700) {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                        return this.$router.push({ name: "Login" });
                    }

                    if (res.data.code === 60000) {

                        //修改vuex的购物袋数量
                        this.changeShopbagCount(this.shopbagCount - this.sids.length);

                        //跳转到订单组件
                        this.$router.push({name: 'Order'});
                    } else {
                        this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000,
                        });
                    }
                    })
                    .catch((err) => {
                    this.$toast.clear();
                    
                    });
            }

        }
    }
</script>

