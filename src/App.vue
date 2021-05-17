<template>
  <div id="app">
    
    <router-view></router-view>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body{
  margin: 0 auto;
  color: #444;
  background-color: #f7f7f7;
  font-size: 16px;
}

.auto-img{
  width: 100%;
  display: block;
}

.clearfix::after{
    content: "";
    display: block;
    clear: both;
}
.fl{
  float: left;
}
.fr{
  float: right;
}

.one-text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
