<template>
  <x-header :left-options="{showBack: false}">个人中心</x-header>
  <template v-if="isLogin">
    <cell title="用户" :value="user.attributes.username"></cell>
    <group title="提交的物品">
      <template v-for="item in items">
        <cell :title="item.name" :value="getStatus(item.status)" is-link :link="getlink(item.id)"></cell>
      </template>
    </group>
    <x-button type="warn" text="登出" @click="logout"></x-button>
  </template>
  <template v-else>
    <x-input title="用户名" name="username" placeholder="请输入用户名" :value.sync="username"></x-input>
    <x-input title="密码" name="password" type="password" placeholder="请输入密码" :value.sync="password"></x-input>
    <x-button type="primary" :text="btnText" :disabled="isDisabled" @click="click"></x-button>
    <x-button type="default" text="注册新用户" @click="reg"></x-button>
    <toast :show.sync="showSuccess">登录成功</toast>
    <toast :show.sync="showCancel" type="cancel">登录失败</toast>
  </template>
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
import { Cell, XHeader, Tabbar, TabbarItem, XInput, XButton, Toast, Group } from 'vux/src/components'

export default {
  components: {
    Cell,
    XHeader,
    Tabbar,
    TabbarItem,
    XInput,
    XButton,
    Toast,
    Group
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      btnText: '登录',
      username: '',
      password: '',
      isDisabled: false,
      showCancel: false,
      showSuccess: false,
      isLogin: false,
      items: []
    }
  },
  created () {
    if (window.userobj) {
      let Items = window.Bmob.Object.extend('items')
      let query = new window.Bmob.Query(Items)
      query.equalTo('user', window.userobj)
      // 查询所有数据
      query.find().then((results) => {
        let temp = []
        console.log('共查询到 ' + results.length + ' 条记录')
        for (let i = 0; i < results.length; i++) {
          let object = results[i]
          let tmp = {
            id: object.id,
            name: object.get('name'),
            status: object.get('status')
          }
          temp.push(tmp)
        }
        this.items = temp
      }, (error) => {
        console.log('查询失败: ' + error.code + ' ' + error.message)
      })
    } else {
      console.log('No Login')
    }
  },
  ready () {
    if (window.user) {
      this.isLogin = true
      this.user = window.userobj
    }
  },
  methods: {
    click: function () {
      this.isDisabled = true
      this.btnText = '登录中...'
      window.Bmob.User.logIn(this.username, this.password).then((user) => {
        this.showSuccess = true
        this.isDisabled = false
        this.btnText = '登录'
        this.isLogin = true
        this.user = user
        window.userobj = user
        window.user = user.id
        this.$router.go('/')
        console.log(this.user)
      }, (user, error) => {
        this.showCancel = true
        this.isDisabled = false
        this.btnText = '登录'
        console.log('Error!' + error)
      })
    },
    reg: function () {
      this.$router.go('/reg')
    },
    logout: function () {
      window.user = ''
      window.Bmob.User.logOut()
      this.user = {}
      this.isLogin = false
      window.userobj = {}
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
    },
    getlink (id) {
      return '/detail/' + id
    }
  }
}
</script>

<style>
</style>