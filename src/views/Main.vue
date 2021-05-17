<template>
    <div class="main">
        <div>
            <router-view></router-view>
        </div>

        <van-tabbar v-model="activeIndex" active-color="#106e33" inactive-color="#646566" route>

            <van-tabbar-item v-for="(item, index) in tabbarData" :key="index" :badge="item.badge > 0 ? item.badge : ''" :dot="item.dot" :to="item.to">
                <span>{{item.title}}</span>
                <template #icon="props">
                <img :src="props.active ? item.icon.active : item.icon.inactive" />
                </template>
            </van-tabbar-item>

        </van-tabbar>
    </div>
</template>

<script>
    export default {
        name: 'Main',
        data(){
            return {
                activeIndex: 0,

                tabbarData: [
                {
                    title: '首页',
                    icon: {
                    active: require('../assets/images/home_active.png'),
                    inactive: require('../assets/images/home.png')
                    },
                    to: '/'
                },
                {
                    title: '菜单',
                    icon: {
                    active: require('../assets/images/menu_active.png'),
                    inactive: require('../assets/images/menu.png')
                    },
                    to: '/menu'
                },
                {
                    title: '购物袋',
                    icon: {
                    active: require('../assets/images/shopbag_active.png'),
                    inactive: require('../assets/images/shopbag.png')
                    },
                    to: '/shopbag'
                },
                {
                    title: '我的',
                    icon: {
                    active: require('../assets/images/my_active.png'),
                    inactive: require('../assets/images/my.png')
                    },
                    dot: false,
                    to: '/my'
                }
                ] 
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .van-info{
        background-color: #106e33;
    }
</style>
