<template>
  <x-header :left-options="{showBack: false}">个人中心</x-header>
  <template v-if="isLogin">
    <blur :blur-amount=40 :url="image">
      <p class="center">
        <img :src="image">
      </p>
      <p class="center">{{ user.get('username') }}</p>
    </blur>
    <group v-if="isAdmin" title="管理员操作">
      <cell v-if="isAdmin" title="管理助手" is-link :link="'/admin'"></cell>
    </group>
    <group title="消息列表">
      <template v-for="chat in chats">
        <cell :title="chat.name" is-link :link="'/chat/' + chat.id">
          <div class="badge-value">
            查看 &nbsp;
            <badge v-if="chat.unread !== '0'" :text="chat.unread"></badge>
          </div>
        </cell>
      </template>
    </group>
    <group title="提交的物品">
      <template v-for="item in items">
        <cell :title="item.name" :value="$root.getStatus(item.status)" is-link :link="'/detail/' + item.id"></cell>
      </template>
      <x-button type="default" text="返回首页" @click="$router.go('/')"></x-button>
    </group>
    <x-button type="warn" text="登出" @click="logout"></x-button>
    <divider></divider>
    <divider></divider>
    <divider></divider>
  </template>
  <template v-else>
    <x-input title="用户名" name="username" placeholder="请输入用户名" :value.sync="username"></x-input>
    <x-input title="密码" name="password" type="password" placeholder="请输入密码" :value.sync="password"></x-input>
    <x-button type="primary" :text="btnText" :disabled="isDisabled" @click="click"></x-button>
    <x-button type="default" text="注册新用户" @click="reg"></x-button>
    <toast :show.sync="showSuccess">登录成功</toast>
    <toast :show.sync="showCancel" type="cancel">登录失败</toast>
  </template>
</template>

<script>
import { Cell, XHeader, XInput, XButton, Toast, Group, Blur, Badge, Divider } from 'vux/src/components'

export default {
  components: {
    Cell,
    XHeader,
    XInput,
    XButton,
    Toast,
    Group,
    Divider,
    Blur,
    Badge
  },
  data () {
    return {
      btnText: '登录',
      username: '',
      password: '',
      isDisabled: false,
      showCancel: false,
      showSuccess: false,
      isLogin: false,
      items: [],
      chats: [],
      user: {},
      image: '',
      isAdmin: false
    }
  },
  created () {
    if (window.userobj) {
      this.isAdmin = window.userobj.get('admin')
      let Items = window.Bmob.Object.extend('items')
      let query = new window.Bmob.Query(Items)
      query.equalTo('user', window.userobj)
      query.ascending('createdAt')
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
      this.isLogin = true
      this.user = window.userobj
      if (this.$parent.image === '') {
        query = new window.Bmob.Query(window.Bmob.User)
        query.get(window.user).then((object) => {
          window.Bmob.Image.thumbnail({'image': object.get('image')._url, 'mode': 0, 'quality': 100, 'width': 800}).then((obj) => {
            this.image = 'http://file.bmob.cn/' + obj.url
          })
        }, (object, error) => {
          console.log('Query Wrong')
        })
      } else {
        window.Bmob.Image.thumbnail({'image': this.$parent.image, 'mode': 0, 'quality': 100, 'width': 800}).then((obj) => {
          this.image = 'http://file.bmob.cn/' + obj.url
        })
      }
      // Chat
      this.chatparse()
    } else {
      console.log('No Login')
    }

    this.$watch('$parent.unread', function (newVal, oldVal) {
      if (newVal + 0 > oldVal + 0) {
        this.chatparse()
      }
    })
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
        this.$parent.unread = user.get('unread') + ''
        this.$parent.image = user.get('image')._url
        this.$router.go('/')
      }, (user, error) => {
        this.showCancel = true
        this.isDisabled = false
        this.btnText = '登录'
        this.isLogin = false
        this.user = false
        window.user = false
        window.userobj = false
        console.log('Error!' + error)
      })
    },
    reg: function () {
      this.$router.go('/reg')
    },
    logout: function () {
      window.user = ''
      window.Bmob.User.logOut()
      this.user = false
      this.isLogin = false
      window.userobj = false
      this.$parent.image = ''
      this.$parent.unread = ''
      this.$router.go('/')
    },
    chatparse: function () {
      let Chat = window.Bmob.Object.extend('chat')
      let other = new window.Bmob.Query(Chat)
      other.equalTo('to', window.userobj)
      let self = new window.Bmob.Query(Chat)
      self.equalTo('from', window.userobj)
      let chatquery = window.Bmob.Query.or(other, self)
      // 查询并解析共有几个聊天对象及未读量
      chatquery.find().then((results) => {
        let temp = []
        let aflag = -1
        let tmp = {}
        console.log('共查到 ' + results.length + ' 条记录')
        for (let i = 0; i < results.length; i++) {
          let object = results[i]
          for (let j = 0; j < temp.length; j++) {
            if (temp[j].id === object.get('from').id || temp[j].id === object.get('to').id) {
              aflag = j
            }
          }
          if (aflag !== -1) {
            if (object.get('read') === false && object.get('to').id === window.user) {
              temp[aflag].unread += 1
            }
            aflag = -1
          } else {
            if (object.get('from').id === window.user) {
              tmp = {
                id: object.get('to').id,
                name: object.get('toname'),
                unread: 0
              }
            } else if (object.get('to').id === window.user) {
              tmp = {
                id: object.get('from').id,
                name: object.get('fromname'),
                unread: 0
              }
            }
            if (object.get('read') === false && object.get('to').id === window.user) {
              tmp.unread = 1
            }
            temp.push(tmp)
          }
        }
        for (let k = 0; k < temp.length; k++) {
          temp[k].unread += ''
        }
        this.chats = temp
      }, (error) => {
        // 查询失败
        console.log('Error!' + error)
      })
    }
  }
}
</script>

<style>
  .center {
  text-align: center;
  padding-top: 20px;
  color: #fff;
  font-size: 18px;
}
.center img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #ececec;
}
.badge-value {
  display: inline-block;
}
</style>