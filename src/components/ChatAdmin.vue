<template>
  <x-header :left-options="{showBack: true}" :right-options="{showMore: true}"  @on-click-more="showMenus = true">与{{ from.get('username') }}的对话</x-header>
  <div class="chat">
    <div class="body-wrapper" :style="'height:'+height">
      <template v-for="msgi in msglist">
        <system-msg v-if="msgi.type==='system'" :msg="msgi.content"></system-msg>
        <other-msg v-if="msgi.type==='other'" :img="fromimg" :msg="msgi.content"></other-msg>
        <self-msg v-if="msgi.type==='self'" :msg="msgi.content"></self-msg>
      </template>
      <!-- <other-msg></other-msg> -->
    </div>
    <div class="foot-wrapper">
      <input class="chat-input" type="text" name="" v-model="msg">
      <span class="chat-sub" :class="{'primary':!!msg}" @click="send(msg)" >发送</span>
    </div>
  </div>
  <actionsheet :menus="menus" :show.sync="showMenus" show-cancel @on-click-menu="click" cancel-text="取消"></actionsheet>
  <confirm :show.sync="show" title="删除确认" @on-confirm="delchat" confirm-text="确认" cancel-text="取消"><p style="text-align:center;">删除后所有聊天记录将丢失，是否确定?</p></confirm>
  <toast :show.sync="showSuccess">发送成功</toast>
  <toast :show.sync="showCancel" type="cancel">发送失败</toast>
</template>

<script>
import { XHeader, Toast, Group, Actionsheet, Confirm } from 'vux/src/components'
import OtherMsg from './OtherMsg'
import SelfMsg from './SelfMsg'
import SystemMsg from './SystemMsg'

export default {
  components: {
    XHeader,
    Actionsheet,
    Toast,
    Group,
    OtherMsg,
    SelfMsg,
    SystemMsg,
    Confirm
  },
  data () {
    return {
      from: {},
      fromimg: '',
      to: {},
      toimg: {},
      msglist: [],
      msg: '',
      showCancel: false,
      showSuccess: false,
      height: document.body.clientHeight - 146 + 'px',
      menus: {
        menu2: '删除此聊天'
      },
      showMenus: false,
      show: false,
      itemname: ''
    }
  },
  ready () {
    if (!window.user) {
      this.$router.go('/user')
    }
    let query = new window.Bmob.Query(window.Bmob.User)
    query.get(this.$route.params.id).then((object) => {
      this.from = object
      window.Bmob.Image.thumbnail({'image': object.get('image')._url, 'mode': 0, 'quality': 100, 'width': 100}).then((obj) => {
        this.fromimg = 'http://file.bmob.cn/' + obj.url
      })
      query.get('YZeiFFFI').then((object) => {
        this.to = object
        window.Bmob.Image.thumbnail({'image': object.get('image')._url, 'mode': 0, 'quality': 100, 'width': 100}).then((obj) => {
          this.toimg = 'http://file.bmob.cn/' + obj.url
        })
        let Chat = window.Bmob.Object.extend('chat')
        let other = new window.Bmob.Query(Chat)
        other.equalTo('from', this.from)
        other.equalTo('to', this.to)
        let self = new window.Bmob.Query(Chat)
        self.equalTo('from', this.to)
        self.equalTo('to', this.from)
        query = window.Bmob.Query.or(other, self)
        query.ascending('createdAt')
        // 查询所有数据
        query.find().then((results) => {
          console.log(results)
          for (let i = 0; i < results.length; i++) {
            let object = results[i]
            let tmp = {
              id: object.id,
              type: '',
              from: object.get('from'),
              to: object.get('to'),
              content: object.get('content')
            }
            let system = tmp.content.split('#system#')
            if (system.length === 2) {
              this.msglist.push({id: object.id, type: 'system', content: system[0]})
              tmp.content = system[1]
            }
            if (tmp.from.id === this.from.id && tmp.to.id === this.to.id) {
              if (object.get('read') === false) {
                object.set('read', true)
                object.save()
                this.to.increment('unread', -1)
                this.to.save()
              }
              tmp.type = 'other'
            }
            if (tmp.from.id === this.to.id && tmp.to.id === this.from.id) {
              tmp.type = 'self'
            }
            this.msglist.push(tmp)
          }
          // Item
          if (this.$route.params.item) {
            let Items = window.Bmob.Object.extend('items')
            this.query = new window.Bmob.Query(Items)
            this.query.get(this.$route.params.item).then((obj) => {
              this.itemname = '通过物品 ' + obj.get('name') + ' 进入对话'
              this.msglist.push({id: object.id, type: 'system', content: this.itemname})
            })
          }
        }, (error) => {
          console.log('查询失败: ' + error.code)
        })
      }, (object, error) => {
        console.log('查询失败: ' + error.code + ' ' + error.message)
      })
    }, (object, error) => {
      console.log('查询失败: ' + error.code + ' ' + error.message)
    })
  },
  methods: {
    click (key) {
      if (key === 'menu2') {
        this.show = true
        console.log('Show Feedback')
      } else {
        console.log(key)
      }
    },
    send (msg) {
      // 调用云逻辑实现发送
      if (this.itemname !== '') {
        msg = this.itemname + '#system#' + msg
      }
      window.Bmob.Cloud.run('sendmsg', {'from': this.to.id, 'to': this.from.id, 'content': msg}).then((result) => {
        console.log(result)
        this.msglist.push({type: 'self', content: msg})
        this.showSuccess = true
      }, (error) => {
        console.log('Error!' + error)
        this.showCancel = true
      })
      console.log(msg)
      this.msg = ''
    },
    delchat () {
      // 调用云逻辑实现删除记录
      window.Bmob.Cloud.run('delchat', {'from': this.from.id, 'to': this.to.id}).then((result) => {
        this.showSuccess = true
        this.$router.go('/user')
      }, (error) => {
        this.showCancel = true
        console.log('Error!' + error)
      })
    }
  }
}
</script>

<style lang='less'>
.chat{
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}
.body-wrapper{
  background-color: #f6f6f6;
  overflow-y: scroll;
}
.foot-wrapper{
  background-color: #f1f1f1;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  padding: 5px 10px;
  justify-content: space-between;
  border-top: solid 1px rgba(0,0,0,0.1);
  .chat-input{
    height: 100%;
    width: 80%;
    border-radius: 10px;
    outline: none;
    border:none; 
    box-sizing: border-box;
    padding: 5px;
  }
  .chat-sub{
    display: flex;
    background-color: rgba(0,0,0,0.1);
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 18%;
    border-radius: 10px;
    outline: none;
  }
  .primary{
    background-color: #3CAF36;
  }
}
</style>