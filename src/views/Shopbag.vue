<template>
    <div class="shopbag">
        <van-nav-bar title="购物袋" left-text="返回" :right-text="isEdit ? '完成' : '编辑'" left-arrow fixed @click-left="back" @click-right="isEdit = !isEdit"/>

        <div v-if="shopbagData.length <= 0">
            <van-empty description="购物袋为空哦，先去逛逛吧！">
            <van-button round color="#106e33" class="bottom-button" @click="goHome">先逛一逛 </van-button>
            </van-empty>
        </div>
        <div class="s-box" v-else>
            <div class="shopbag-box">
                <div class="shopbag-item" v-for="(item, index) in shopbagData" :key="index">
                    <div class="cell-item">
                        <van-swipe-cell :disabled="!isEdit">
                        <div class="clearfix">
                            <div class="fl check-box">
                                <van-checkbox v-model="item.isChecked" checked-color="#106e33" @change="simpleSelect"/>
                            </div>
                            <div class="fl pro-box">
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
                                         <div class="fr">
                                             <van-stepper v-model="item.count" theme="round" button-size="22" disable-input @change="updateShopbagCount(item.sid, item.count)"/>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                        <template #right>
                            <van-button class="shopbag-remove-btn"
                            color="#106e33"
                            square
                            text="删除"
                            @click="removeShopbag([item.sid], index)"
                            />
                        </template>
                        </van-swipe-cell>
                    </div>
                </div>
            </div> 


             <van-submit-bar v-show="!isEdit" :price="total" button-text="提交订单" button-color="#106e33" @submit="commit">
                <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
            </van-submit-bar> 

            <van-submit-bar
                v-show="isEdit"
                button-text="删除选择"
                button-color="#106e33"
                @submit="removeSelect"
            >
                <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
            </van-submit-bar>



             
        </div>

    </div>
</template>

<script>
    import '../assets/less/shopbag.less'
    import { mapState, mapMutations } from "vuex";

    export default {
    name: "Shopbag",

    data() {
        return {
        //是否编辑商品
        isEdit: false,

        //全选或者取消全选
        checked: false,

        //购物袋所有数据
        shopbagAllData: [],

        //购物袋数据
        shopbagData: [],

        //开始截取位置
        start: 0,

        //每次获取10条数据
        count: 7,

        //是否加载, 首次不触发懒加载
        loading: true,

        //是否全部加载完毕
        finished: false,

        //总金额
        total: 0,
        };
    },

    created() {
        this.getShopbagData();
    },

    computed: {
        ...mapState(["shopbagCount"]),
    },

    methods: {
        ...mapMutations(["changeShopbagCount"]),

        //返回上一级
        back() {
        this.$router.go(-1);
        },

        goHome() {
        this.$router.push({ name: "Home" });
        },

        //切换编辑状态
        toggleEditStatus() {
        this.isEdit = !this.isEdit;
        },

        //获取购物袋数据
        getShopbagData() {
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
            url: this.baseUrl + "/findAllShopcart",
            params: {
            appkey: this.appkey,
            tokenString,
            },
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

            if (res.data.code === 5000) {
                res.data.result.forEach((v) => {
                v.isChecked = false;
                });

                this.shopbagAllData = res.data.result;

                this.shopbagData = this.shopbagAllData.slice(
                this.start,
                this.start + this.count
                );

                this.start += this.count;

                if (this.shopbagAllData.length < this.count) {
                this.finished = true;
                return;
                }

                //下次触底进行懒加载
                this.loading = false;
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

        //加载数据
        loadShopbagData() {
        setTimeout(() => {
            

            let data = this.shopbagAllData.slice(
            this.start,
            this.start + this.count
            );

            this.shopbagData.push(...data);
            this.start += this.count;

            //取消全选
            if (data.length > 0) {
            this.checked = false;
            }

            //如果本次截取不足this.count条数据, 下次不可能有数据
            if (data.length < this.count) {
            
            this.finished = true;
            return;
            }

            //下次进行触底懒加载
            this.loading = false;
        }, 1000);
        },

        //修改购物袋数量
        updateShopbagCount(sid, count) {
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
            method: "POST",
            url: this.baseUrl + "/modifyShopcartCount",
            data: {
            appkey: this.appkey,
            tokenString,
            sid,
            count,
            },
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

            if (res.data.code === 6000) {
                this.sum();
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

        //全选
        allSelect() {
        //将所有单选状态修改位全选状态
        this.shopbagData.forEach((v) => {
            v.isChecked = this.checked;
        });

        this.sum();
        },

        //单选
        simpleSelect() {
        this.sum();

        //只要有一个单选没有勾选，则全选不能勾选
        for (let i = 0; i < this.shopbagData.length; i++) {
            if (!this.shopbagData[i].isChecked) {
            this.checked = false;
            return;
            }
        }

        this.checked = true;
        },

        removeShopbag(sids, index) {
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
            method: "POST",
            url: this.baseUrl + "/deleteShopcart",
            data: {
            appkey: this.appkey,
            tokenString,
            sids: JSON.stringify(sids),
            },
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

            if (res.data.code == 7000) {
                //如果是单个
                if (index !== undefined) {
                this.shopbagData.splice(index, 1);

                this.changeShopbagCount(this.shopbagCount - 1);

                this.simpleSelect();
                } else {
                //执行多个删除
                for (let i = 0; i < this.shopbagData.length; i++) {
                    if (this.shopbagData[i].isChecked) {
                    this.shopbagData.splice(i, 1);
                    i--;
                    }
                }

                this.changeShopbagCount(this.shopbagCount - sids.length);
                this.sum();
                }

                this.$nextTick(() => {
                let cells = document.querySelectorAll(".shopbag-cell");

                

                if (cells.length === 0 && this.shopbagData.length < this.shopbagAllData.length) {
                    //触发懒加载
                    this.loadShopbagData();
                } else {

                    //获取最后一个节点距离可视区域的尺寸
                    let cellSzie = cells[cells.length - 1].getBoundingClientRect();

                    //获取最后一个节点距离可视区域页面顶部的距离
                    let distance = cellSzie.top;

                    //获取最后一个节点的高度
                    let cellHeight = cellSzie.height;

                    //获取屏幕高度
                    let innerHeight = window.innerHeight;
                    if (distance + cellHeight - innerHeight <= 50) {
                    //触发懒加载
                    this.loadShopbagData();
                    }
                }
                });
            }

            this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 3000,
            });
            })
            .catch((err) => {
            this.$toast.clear();
            
            });
        },

        //删除选择的购物袋商品
        removeSelect() {
        //获取勾选的sid
        let sids = [];
        this.shopbagData.forEach((v) => {
            if (v.isChecked) {
            sids.push(v.sid);
            }
        });

        if (sids.length === 0) {
            this.$toast({
            message: "未选择删除商品",
            forbidClick: true,
            duration: 3000,
            });

            return;
        }

        

        this.removeShopbag(sids);
        },

        //计算勾选的商品总金额
        sum() {
        let total = 0;
        this.shopbagData.forEach((v) => {
            if (v.isChecked) {
            total += v.price * v.count;
            }
        });

        this.total = total * 100;
        },

        //提交订单
        commit() {
        //获取勾选的sid
        let sids = [];
        this.shopbagData.forEach((v) => {
            if (v.isChecked) {
            sids.push(v.sid);
            }
        });

        if (sids.length === 0) {
            this.$toast({
            message: "选择下单的商品",
            forbidClick: true,
            duration: 3000,
            });

            return;
        }

        this.$router.push({name: 'Pay', query: {sids: sids.join('-')}});

        
        }
    }
    };
</script>