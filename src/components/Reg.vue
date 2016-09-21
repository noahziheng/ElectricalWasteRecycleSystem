<template>
  <x-header :left-options="{showBack: false}">个人中心</x-header>
  <x-input title="用户名" name="username" placeholder="请输入用户名" :value.sync="username"></x-input>
  <x-input title="密码" name="password" type="password" placeholder="请输入密码" :value.sync="password"></x-input>
  <x-input title="密码确认" type="password" placeholder="请再次输入密码" :equal-with="password"></x-input>
  <x-input title="邮箱" name="email" placeholder="请输入邮箱地址" is-type="email" :value.sync="email"></x-input>
  <x-button type="primary" :text="btnText" :disabled="isDisabled" @click="click"></x-button>
  <x-button type="default" text="返回登录" @click="login"></x-button>
  <toast :show.sync="showSuccess">注册成功</toast>
  <toast :show.sync="showCancel" type="cancel">注册失败</toast>
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
      btnText: '注册',
      username: '',
      password: '',
      email: '',
      isDisabled: false,
      showCancel: false,
      showSuccess: false
    }
  },
  methods: {
    click: function () {
      this.isDisabled = true
      this.btnText = '注册中...'
      let user = new window.Bmob.User()
      user.set('username', this.username)
      user.set('password', this.password)
      user.set('email', this.email)
      user.signUp(null).then((user) => {
        this.showSuccess = true
        this.isDisabled = false
        this.btnText = '注册'
        console.log(this.user)
        this.$router.go('user')
      }, (user, error) => {
        this.showCancel = true
        this.isDisabled = false
        this.btnText = '注册'
        console.log('Error!' + error)
      })
    },
    login: function () {
      this.$router.go('user')
    }
  }
}
</script>

<style>
</style>