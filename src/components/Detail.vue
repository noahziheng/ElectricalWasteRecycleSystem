<template>
  <x-header :left-options="{showBack: false}">物品详情</x-header>
  <cell title="物品名称" :value="name"></cell>
  <cell title="当前状态" :value="getStatus(status)"></cell>
  <cell title="所在位置" :value="location"></cell>
  <cell title="发布者" :value="itemusername"></cell>
  <cell title="联系方式" :value="contact"></cell>
  <card :header="{title:'物品详情'}">
    <p slot="content" class="card-padding">{{ description }}</p>
  </card>
  <template v-if="user === itemuser">
    <template v-if="status === 0">
      <x-button type="primary" text="交易完成" @click="finish"></x-button>
      <x-button type="default" text="提交回收" @click="receive"></x-button>
    </template>
    <x-button type="warn" text="删除物品" @click="showConfirm = true"></x-button>
  </template>
  <x-button type="default" text="返回首页" @click="back"></x-button>
  <toast :show.sync="showSuccess">提交成功</toast>
  <toast :show.sync="showCancel" type="cancel">提交失败</toast>
  <confirm :show.sync="showConfirm" title="删除确认" @on-confirm="delitem"><p style="text-align:center;">是否确定删除?</p></confirm>
  <div>
    <tabbar>
      <tabbar-item link="/">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_cell.png">
        <span slot="label">列表</span>
      </tabbar-item>
      <tabbar-item selected link="/user">
        <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_article.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Cell, XHeader, Tabbar, TabbarItem, XInput, XButton, Toast, Group, Card, Confirm } from 'vux/src/components'

export default {
  components: {
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    XInput,
    XButton,
    Toast,
    Group,
    Card,
    Confirm
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      name: '',
      status: 0,
      description: '',
      contact: '',
      location: '',
      itemuser: '',
      itemusername: '',
      isDisabled: false,
      showCancel: false,
      showSuccess: false,
      isLogin: false,
      showConfirm: false,
      user: ''
    }
  },
  ready () {
    let Items = window.Bmob.Object.extend('items')
    // 创建查询对象，入口参数是对象类的实例
    let query = new window.Bmob.Query(Items)
    // 查询单条数据，第一个参数是这条数据的objectId值
    query.get(this.$route.params.id).then((object) => {
    // 查询成功，调用get方法获取对应属性的值
      this.name = object.get('name')
      this.status = object.get('status')
      this.description = object.get('description')
      this.contact = object.get('contact')
      this.location = object.get('location')
      this.itemuser = object.get('user').id
      query = new window.Bmob.Query(window.Bmob.User)
      query.get(object.get('user').id).then((man) => {
        this.itemusername = man.get('username')
      })
    }, (object, error) => {
      console.log('查询失败: ' + error.code + ' ' + error.message)
    })
    if (window.user) {
      this.user = window.user
    } else {
      this.user = false
    }
  },
  methods: {
    finish: function () {
      let Items = window.Bmob.Object.extend('items')
      // 创建查询对象，入口参数是对象类的实例
      let query = new window.Bmob.Query(Items)
      // 查询单条数据，第一个参数是这条数据的objectId值
      query.get(this.$route.params.id).then((object) => {
      // 查询成功，调用get方法获取对应属性的值
        object.set('status', 1)
        object.save()
        this.showSuccess = true
        this.status = 1
        // this.$router.go('/user')
        console.log('create object success, object id:' + object.id)
      }, (object, error) => {
        this.showCancel = true
        console.log('Error!' + error.code + ' ' + error.message)
      })
    },
    receive: function () {
      let Items = window.Bmob.Object.extend('items')
      // 创建查询对象，入口参数是对象类的实例
      let query = new window.Bmob.Query(Items)
      // 查询单条数据，第一个参数是这条数据的objectId值
      query.get(this.$route.params.id).then((object) => {
      // 查询成功，调用get方法获取对应属性的值
        object.set('status', 2)
        object.save()
        this.showSuccess = true
        this.status = 2
        // this.$router.go('/user')
        console.log('create object success, object id:' + object.id)
      }, (object, error) => {
        this.showCancel = true
        console.log('Error!' + error.code + ' ' + error.message)
      })
    },
    delitem: function () {
      let Items = window.Bmob.Object.extend('items')
      // 创建查询对象，入口参数是对象类的实例
      let query = new window.Bmob.Query(Items)
      // 查询单条数据，第一个参数是这条数据的objectId值
      query.get(this.$route.params.id).then((object) => {
      // 查询成功，调用get方法获取对应属性的值
        object.set('status', 2)
        object.destroy((object) => {
          this.showSuccess = true
          this.$router.go('/')
          console.log('success, object id:' + object.id)
        }, (object, error) => {
          this.showCancel = true
          console.log('Error!' + error.code + ' ' + error.message)
        })
      }, (object, error) => {
        this.showCancel = true
        console.log('Error!' + error.code + ' ' + error.message)
      })
    },
    back: function () {
      this.$router.go('/')
    },
    getStatus: function (key) {
      if (key === 0) {
        return '待交易'
      } else if (key === 1) {
        return '已完成交易'
      } else if (key === 2) {
        return '已提交回收'
      } else {
        return '状态异常'
      }
    }
  }
}
</script>

<style scoped lang="less">
.card-padding {
  padding: 15px;
}
</style>