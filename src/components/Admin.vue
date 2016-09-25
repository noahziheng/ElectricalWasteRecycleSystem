<template>
  <x-header :left-options="{showBack: true}">管理助手</x-header>
  <group title="消息列表">
    <template v-for="chat in chats">
      <cell :title="chat.name" is-link :link="'/chatadmin/' + chat.id">
        <div class="badge-value">
          查看 &nbsp;
          <badge v-if="chat.unread !== '0'" :text="chat.unread"></badge>
        </div>
      </cell>
    </template>
  </group>
  <group title="提交回收的物品">
    <template v-for="item in items">
      <cell :title="item.name" :value="$root.getStatus(item.status)" is-link :link="'/detail/' + item.id"></cell>
    </template>
  </group>
  <x-button type="default" text="返回首页" @click="$router.go('/')"></x-button>
  <divider></divider>
  <divider></divider>
  <divider></divider>
</template>

<script>
import { Cell, XHeader, XButton, Toast, Group, Badge, Divider } from 'vux/src/components'

export default {
  components: {
    Cell,
    XHeader,
    XButton,
    Toast,
    Group,
    Divider,
    Badge
  },
  data () {
    return {
      showCancel: false,
      showSuccess: false,
      isLogin: false,
      items: [],
      chats: [],
      isAdmin: false
    }
  },
  created () {
    if (!window.user) {
      this.$router.go('/user')
    }
    if (window.userobj) {
      this.isAdmin = window.userobj.get('admin')
      let Items = window.Bmob.Object.extend('items')
      let query = new window.Bmob.Query(Items)
      query.greaterThanOrEqualTo('status', 1)
      query.ascending('status')
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
    chatparse: function () {
      let Chat = window.Bmob.Object.extend('chat')
      let chatquery = new window.Bmob.Query(Chat)
      chatquery.equalTo('to', 'YZeiFFFI')
      // 查询并解析共有几个聊天对象及未读量
      chatquery.find().then((results) => {
        console.log(results)
        let temp = []
        let aflag = -1
        let tmp = {}
        console.log('共查到 ' + results.length + ' 条记录')
        for (let i = 0; i < results.length; i++) {
          let object = results[i]
          for (let j = 0; j < temp.length; j++) {
            if (temp[j].id === object.get('from').id) {
              aflag = j
            }
          }
          if (aflag !== -1) {
            if (object.get('read') === false && object.get('to').id === 'YZeiFFFI') {
              temp[aflag].unread += 1
            }
            aflag = -1
          } else {
            tmp = {
              id: object.get('from').id,
              name: object.get('fromname'),
              unread: 0
            }
            if (object.get('read') === false && object.get('to').id === 'YZeiFFFI') {
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