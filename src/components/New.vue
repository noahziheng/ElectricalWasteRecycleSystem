<template>
  <x-header :left-options="{showBack: false}">提交新物品</x-header>
  <x-input title="物品名称" name="name" placeholder="请输入物品名称" :value.sync="name"></x-input>
  <group title="物品描述">
    <x-textarea :max="200" placeholder="请输入详细描述" :value.sync="description"></x-textarea>
  </group>
  <address title="所在位置" :value.sync="location" :list="addressData" placeholder="请选择地址"></address>
  <x-input title="联系方式" name="contact" placeholder="请输入联系方式（限手机号）" :value.sync="contact" keyboard="number" is-type="china-mobile"></x-input>
  <x-button type="primary" :text="btnText" :disabled="isDisabled" @click="click"></x-button>
  <x-button type="default" text="返回首页" @click="back"></x-button>
  <toast :show.sync="showSuccess">提交成功</toast>
  <toast :show.sync="showCancel" type="cancel">提交失败</toast>
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
import { XHeader, Tabbar, TabbarItem, XInput, XTextarea, XButton, Toast, Group, Address, AddressChinaData } from 'vux/src/components'
import value2name from 'vux/src/filters/value2name'

export default {
  components: {
    XHeader,
    Tabbar,
    TabbarItem,
    XInput,
    XTextarea,
    XButton,
    Toast,
    Group,
    Address
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      btnText: '提交',
      name: '',
      description: '',
      contact: '',
      location: ['120000', '120100', '120101'],
      isDisabled: false,
      showCancel: false,
      showSuccess: false,
      addressData: AddressChinaData
    }
  },
  ready () {
    if (!window.user) {
      this.$router.go('/user')
    }
  },
  methods: {
    click: function () {
      this.isDisabled = true
      this.btnText = '提交中...'
      let Items = window.Bmob.Object.extend('items')
      let items = new Items()
      items.set('location', value2name(this.location, AddressChinaData))
      items.set('user', window.userobj)
      items.set('name', this.name)
      items.set('description', this.description)
      items.set('contact', this.contact)
      items.set('status', 0)
      items.save(null).then((object) => {
        this.showSuccess = true
        this.isDisabled = false
        this.btnText = '提交'
        this.$router.go('/user')
        console.log('create object success, object id:' + object.id)
      },
      (model, error) => {
        this.showCancel = true
        this.isDisabled = false
        this.btnText = '提交'
        console.log('Error!' + error)
      })
    },
    back: function () {
      this.$router.go('/')
    }
  }
}
</script>

<style>
</style>