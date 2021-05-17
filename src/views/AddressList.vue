<template>
    <div class="addresslist">
        <van-nav-bar title="地址列表" left-text="返回" left-arrow @click-left="back" />
        <div class="b-box">
            <div class="bg"></div>
            <div class="content">
                <van-address-list
                :list="list"
                default-tag-text="默认"
                :switchable="false"
                @add="add"
                @edit="edit"
                />
            </div>
        </div>
        
    </div>
</template>

<script>
    import "../assets/less/addresslist.less";
    export default {
        name:'Addresslist',
        data(){
            return {
                list:[]
            }
            },
        created() {
            this.getAddressListData();
        },

        methods: {
            back() {
            this.$router.go(-1);
            },

            //新增
            add() {
            this.$router.push({name: 'NewAddress'});
            },

            //编辑
            edit({aid}) {
            this.$router.push({name: 'NewAddress', params: {aid}});
            },

            //查询用户地址列表
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
            }
        }
    }
</script>
