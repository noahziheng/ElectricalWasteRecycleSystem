<template>
  <div id="app">
    <router-view></router-view>
    <!--bottom slot-->
    <tabbar class="vux-demo-tabbar" icon-class="vux-center" slot="bottom">
      <tabbar-item link="/" :selected="$route.path === '/'">
        <icon slot="icon" name="list" scale="2" class="tab_icon"></icon>
        <span slot="label">列表</span>
      </tabbar-item>
      <tabbar-item link="/new" :selected="$route.path === '/new'">
        <icon slot="icon" name="plus" scale="2" class="tab_icon"></icon>
        <span slot="label">新增</span>
      </tabbar-item>
      <tabbar-item link="/user" :selected="$route.path === '/user'" :badge="unread">
        <icon slot="icon" name="user" scale="2" class="tab_icon"></icon>
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux/src/components'
  import Icon from 'vue-awesome/src/components/icon'

  export default {
    components: {
      Tabbar,
      TabbarItem,
      Icon
    },
    data () {
      return {
        msg: 'Hello World!',
        unread: '',
        image: '',
        defaultimage: {}
      }
    },
    created () {
      this.reloaduser()
      window.BmobSocketIo.initialize('b5bca53e8b7e474ae626d2d557dc9f78')
      window.BmobSocketIo.updateTable('_User')
      window.BmobSocketIo.onUpdateTable = this.socketon
      this.$watch('unread', function (newVal, oldVal) {
        if (newVal === '0') {
          this.unread = ''
        }
      })
    },
    methods: {
      getStatus: function (key) {
        if (key === 0) {
          return '待交易'
        } else if (key === 1) {
          return '已提交回收'
        } else if (key === 2) {
          return '已回收'
        } else if (key === 3) {
          return '已完成交易'
        } else {
          return '状态异常'
        }
      },
      socketon: function (tablename, data) {
        console.log(data.unread)
        if (data.objectId === window.user) {
          if (data.unread === 0) {
            this.unread = ''
          } else {
            this.unread = data.unread + ''
          }
        }
      },
      reloaduser: function () {
        let query = new window.Bmob.Query(window.Bmob.User)
        query.get(window.user).then((object) => {
          query.get('YZeiFFFI').then((obj) => {
            this.defaultimage._url = 'http://bmob-cdn-6443.b0.upaiyun.com/2016/09/27/8670bde64038181e806a9e05a8df01e1.jpg'
            if (!object.get('image')) {
              this.image = obj.get('image')._url
            } else {
              this.image = object.get('image')._url
            }
          })
          if (object.get('unread') !== 0) {
            this.unread = object.get('unread') + ''
          }
        }, (object, error) => {
          console.log('Query Wrong')
        })
      }
    }
  }
</script>

<style lang="less">
    @import '~vux/src/styles/reset';
    html, body {
      height: 100%;
      width: 100%;
      overflow-x: hidden;
    }
    body {
      background-color: #fbf9fe;
    }
    .weui_tabbar.vux-demo-tabbar {
      background: rgb(247, 247, 250);
    }
    .tab_icon {
      color: #35495e;
    }
    .vux-demo-tabbar-component {
      background-color: #F70968;
      border-radius: 7px;
      padding: 0 4px;
      line-height: 14px;
    }
    .weui_tabbar_icon + .weui_tabbar_label {
      margin-top: 0!important;
    }
    .vux-demo-header-box {
      z-index: 100;
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
    }
    .weui_tab_bd {
      padding-top: 46px;
    }
</style>