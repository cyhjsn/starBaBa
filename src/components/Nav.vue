<template>
    <div class="nav">
        <van-nav-bar left-arrow>
            <template #left>
                <div class="left-title">
                    <div class="logo">
                        <img class="auto-img" src="../assets/images/logo.png" alt="" />
                    </div>
                    <div class="logo-title">Starbaba Coffee</div>
                </div>
            </template>

            <template #right>
                <div class="right-title" @click="goHome()">
                    先逛逛
                </div>
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
import '../assets/less/nav.less'
export default {
        methods:{
            goHome(){
            this.$router.push({name: 'Home'})
        }
        }
}
</script>
