<template>
  <x-header :left-options="{showBack: false}">个人中心</x-header>
  <x-input title="用户名" name="username" placeholder="请输入用户名" :value.sync="username"></x-input>
  <x-input title="密码" name="password" type="password" placeholder="请输入密码" :value.sync="password"></x-input>
  <x-input title="密码确认" type="password" placeholder="请再次输入密码" :equal-with="password"></x-input>
  <x-input title="邮箱" name="email" placeholder="请输入邮箱地址" is-type="email" :value.sync="email"></x-input>
  <cell title="头像上传"  inline-desc="建议您上传头像获得更好体验">
    <input id="fileUpload" type="file" accept="image/*" value="浏览文件" />
  </cell>
  <x-button type="primary" :text="btnText" :disabled="isDisabled" @click="click"></x-button>
  <x-button type="default" text="返回登录" @click="login"></x-button>
  <toast :show.sync="showSuccess">注册成功</toast>
  <toast :show.sync="showCancel" type="cancel">注册失败</toast>
</template>

<script>
import { Cell, XHeader, XInput, XButton, Toast, Group } from 'vux/src/components'
import $ from 'jquery'

export default {
  components: {
    Cell,
    XHeader,
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
      user.set('admin', false)
      user.set('unread', 0)
      let fileUploadControl = $('#fileUpload')[0]
      let file = fileUploadControl.files[0]
      if (fileUploadControl.files.length > 0) {
        let name = file.name
        let fileobj = new window.Bmob.File(name, file)
        user.set('image', fileobj)
      }
      user.signUp(null).then((user) => {
        this.showSuccess = true
        this.isDisabled = false
        this.btnText = '注册'
        console.log(this.user)
        window.BmobSocketIo.initialize('b5bca53e8b7e474ae626d2d557dc9f78')
        window.BmobSocketIo.updateTable('_User')
        window.BmobSocketIo.onUpdateTable = this.$parent.socketon
        window.Bmob.Cloud.run('sendmsg', {'from': 'YZeiFFFI', 'to': user.id, 'content': '欢迎您使用电子废弃物再利用系统！如有使用问题，请直接向我发送消息，工作人员将在72小时内处理！'}).then((result) => {
          console.log(result)
        }, (error) => {
          console.log('Error!' + error)
        })
        this.$router.go('user')
      }, (user, error) => {
        this.showCancel = true
        this.isDisabled = false
        this.btnText = '注册'
        console.log('Error!')
      })
    },
    login: function () {
      this.$router.go('user')
    }
  }
}
</script>