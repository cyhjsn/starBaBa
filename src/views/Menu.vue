<template>
  <div class="menu">
    <div class="search">
    </div>

    <div class="classification">
      <div class="cf-item" v-for="(item, index) in menuOption" :key="index" @click="changeMenu(index, item.type)">
        <div class="cf-item-box">
          <div class="item-icon">
            <img class="auto-img" :src="menuIndex == index ? item.activeIcon : item.inactiveIcon" alt="">
          </div>
          <div class="item-text" :class="{active: menuIndex == index}">{{item.title}}</div>
        </div>
      </div>
    </div>


    <div class="product-items">
        <Product class="product-item" v-for="(item, index) in productData" :key="index" :product="item">
        </Product>
      </div>


  </div>
</template>

<script>
import '../assets/less/menu.less'
import Product from '../components/Product'
  export default {
    name: 'Menu',
    data(){
    return {
      menuIndex:0,
      menuOption:[
        {
          title: '推荐',
          inactiveIcon: require('../assets/images/icons_09.gif'),
          activeIcon:require('../assets/images/icons_21.gif')
        },
        {
          title: '拿铁',
          inactiveIcon: require('../assets/images/icons_05.gif'),
          activeIcon:require('../assets/images/icons_19.gif')
        },
        {
          title: '咖啡',
          inactiveIcon: require('../assets/images/icons_03.gif'),
          activeIcon:require('../assets/images/icons_18.gif')
        },
        {
          title: '冰饮',
          inactiveIcon: require('../assets/images/icons_07.gif'),
          activeIcon:require('../assets/images/icons_20.gif')
        },
      ],
      productData:[]
    }
    },
    created(){
    this.getTypes();
    }, 
    components:{
      Product
    },
    methods:{
      changeMenu(index,type){
        if(this.menuIndex == index){
          return; 
        }
        this.menuIndex = index;
        this.getProductByType(type);
      },

      getTypes(){
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
 
        this.axios({
          method: "GET",
          url: this.baseUrl + "/type",
          params:{
            appkey:this.appkey
          },
        })
          .then((result) => {
            this.$toast.clear();
            if(result.data.code == 400){
              let data = result.data.result;
              data.unshift({
                type: 'isHot',
                typeDesc: '推荐'
              })  
              this.menuOption.map(v => {
                for(let i =0; i<data.length; i++){
                  if(v.title == data[i].typeDesc){
                    v.type = data[i].type;
                    break;
                  }
                }
              })
              let type = this.menuOption[this.menuIndex].type;
              this.getProductByType(type);
            }
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
      },

      getProductByType(type){
        let params = {
            appkey: this.appkey
        };
        if (type == 'isHot'){
          params.key = 'isHot';
          params.value = 1;
        }else{
          params.key = 'type';
          params.value = type; 
        }
        
        

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "GET",
          url: this.baseUrl + "/typeProducts",
          params,
        })
          .then((result) => {
            this.$toast.clear();
            

            if(result.data.code == 500){
              this.productData = result.data.result; 
            }
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
      },
    }
  }
</script>