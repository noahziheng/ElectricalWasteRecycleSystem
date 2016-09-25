<template>
  <x-header :left-options="{showBack: false}">提交新物品</x-header>
  <group>
    <x-input title="物品名称" name="name" placeholder="请输入物品名称" :value.sync="name"></x-input>
    <selector placeholder="请选择分类" title="分类" :options="grouplist" :value.sync="group"></selector>
    <group title="物品描述">
      <x-textarea :max="200" :rows="6" placeholder="请输入详细描述，要求至少包含：
    1.物品的型号与基本参数
    2.物品的外观和功能的完整程度
    3.物品的购买渠道及时间
    4.保修的有关情况" :value.sync="description"></x-textarea>
    </group>
    <cell title="成色自评">
      <rater :value.sync="rate" slot="value" star="☻" active-color="#FF9900" :margin="5"></rater>
    </cell>
    <x-number :value.sync="lifetime" title="已使用年限" :step="0.5"></x-number>
    <x-number :value.sync="price" title="理想价格" :min="0.5" :max="100000" :step="0.5">元</x-number>
    <address title="所在位置" :value.sync="location" :list="addressData" placeholder="请选择地址"></address>
    <x-input title="联系方式" name="contact" placeholder="请输入联系方式（限手机号）" :value.sync="contact" keyboard="number" is-type="china-mobile"></x-input>
    <cell title="图片上传">
      <input id="fileUpload" type="file" accept="image/*" value="浏览文件" />
    </cell>
    <switch title="直接提交回收" :value.sync="recycle"></switch>
  </group>
  <group>
    <x-button type="primary" :text="btnText" :disabled="isDisabled" @click="click"></x-button>
    <x-button type="default" text="返回首页" @click="back"></x-button>
  </group>
  <divider></divider>
  <divider></divider>
  <divider></divider>
  <toast :show.sync="showSuccess">提交成功</toast>
  <toast :show.sync="showCancel" type="cancel">提交失败</toast>
  <toast :show.sync="showEmpty" type="cancel">信息填写不全</toast>
</template>

<script>
import { XHeader, XInput, XTextarea, XButton, Toast, Group, Address, AddressChinaData, Cell, Rater, XNumber, Selector, Switch, Divider } from 'vux/src/components'
import value2name from 'vux/src/filters/value2name'
import $ from 'jquery'

export default {
  components: {
    XHeader,
    XInput,
    XTextarea,
    XButton,
    Toast,
    Group,
    Address,
    Cell,
    Rater,
    XNumber,
    Selector,
    Switch,
    Divider
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
      rate: 5,
      price: 1,
      lifetime: 0,
      location: ['120000', '120100', '120101'],
      group: '',
      grouplist: ['其他', '手机', '电脑', '家用电器', '摄影', '智能数码'],
      isDisabled: false,
      showCancel: false,
      showSuccess: false,
      showEmpty: false,
      addressData: AddressChinaData,
      files: [],
      recycle: false
    }
  },
  ready () {
    if (!window.user) {
      this.$router.go('/user')
    }
    if (this.$route.params.id) {
      let Items = window.Bmob.Object.extend('items')
      let query = new window.Bmob.Query(Items)
      query.get(this.$route.params.id).then((object) => {
        this.name = object.get('name')
        this.status = object.get('status')
        this.description = object.get('description')
        this.contact = object.get('contact')
        this.itemuser = object.get('user').id
        this.rate = object.get('rate')
        this.price = object.get('price')
        this.lifetime = object.get('lifetime')
        this.group = object.get('group')
      })
    }
  },
  methods: {
    click: function () {
      if (this.name === '' || this.description === '' || this.contact === '' || this.group === '') {
        this.showEmpty = true
        console.log('Empty')
      } else {
        this.isDisabled = true
        this.btnText = '提交中...'
        let Items = window.Bmob.Object.extend('items')
        if (this.$route.params.id) {
          var query = new window.Bmob.Query(Items)
          query.get(this.$route.params.id).then((items) => {
            this.saveitem(items)
          })
        } else {
          let items = new Items()
          this.saveitem(items)
        }
      }
    },
    saveitem: function (items) {
      if (this.location !== ['120000', '120100', '120101']) {
        items.set('location', value2name(this.location, AddressChinaData))
      }
      items.set('user', window.userobj)
      items.set('name', this.name)
      items.set('description', this.description)
      items.set('contact', this.contact)
      items.set('rate', this.rate)
      items.set('price', this.price)
      items.set('lifetime', this.lifetime)
      items.set('group', this.group)
      if (this.recycle) {
        items.set('status', 2)
      } else {
        items.set('status', 0)
      }
      let fileUploadControl = $('#fileUpload')[0]
      let file = fileUploadControl.files[0]
      if (fileUploadControl.files.length > 0) {
        let name = file.name
        let fileobj = new window.Bmob.File(name, file)
        items.set('image', fileobj)
      }
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