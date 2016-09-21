<template>
  <x-header :left-options="{showBack: false}"  :right-options="{showMore: true}"  @on-click-more="showMenus = true">电子废弃物再利用系统</x-header>
  <template v-for="item in items">
    <cell :title="item.name" value="查看详情" :inline-desc="item.location" is-link :link="getlink(item.id)"></cell>
  </template>
  <div>
    <tabbar>
      <tabbar-item selected link="/">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_cell.png">
        <span slot="label">列表</span>
      </tabbar-item>
      <tabbar-item link="/user">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_article.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
  <actionsheet :menus="menus" :show.sync="showMenus" show-cancel @on-click-menu="click"></actionsheet>
  <alert :show.sync="show" title="联系我们" button-text="知道了">
    <p style="text-align:center;">如有使用问题，请发送邮件到<br>noahgaocn@gmail.com</p>
    <p style="text-align:center;">如有交易、回收问题，请联系<br>天津科技大学<br>电子信息与自动化学院<br>青年志愿者协会<br>微信公众号TUSTDX志协</p>
  </alert>
</template>

<script>
import { Cell, XHeader, Tabbar, TabbarItem, Actionsheet, Alert } from 'vux/src/components'

export default {
  components: {
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    Actionsheet,
    Alert
  },
  data () {
    return {
      menus: {
        menu1: '提交新物品',
        menu2: '联系我们'
      },
      showMenus: false,
      show: false,
      items: []
    }
  },
  created () {
    let Items = window.Bmob.Object.extend('items')
    let query = new window.Bmob.Query(Items)
    query.equalTo('status', 0)
    // 查询所有数据
    query.find().then((results) => {
      let temp = []
      console.log('共查询到 ' + results.length + ' 条记录')
      for (let i = 0; i < results.length; i++) {
        let object = results[i]
        let tmp = {
          id: object.id,
          name: object.get('name'),
          location: object.get('location')
        }
        temp.push(tmp)
      }
      this.items = temp
    }, (error) => {
      console.log('查询失败: ' + error.code + ' ' + error.message)
    })
  },
  methods: {
    click (key) {
      if (key === 'menu1') {
        this.$router.go('/new')
      } else if (key === 'menu2') {
        this.show = true
        console.log('Show Feedback')
      } else {
        console.log(key)
      }
    },
    getlink (id) {
      return '/detail/' + id
    }
  }
}
</script>

<style>
</style>