<template>
  <x-header :left-options="{showBack: true}">物品详情</x-header>
  <cell title="物品名称" :value="name"></cell>
  <cell title="物品分类"><badge :text="group"></badge></cell>
  <cell title="当前状态" :value="$root.getStatus(status)"></cell>
  <cell title="成色自评">
    <rater :value.sync="rate" slot="value" star="☻" active-color="#FF9900" :margin="5" disabled></rater>
  </cell>
  <cell title="已使用年限">{{ lifetime }} 年</cell>
  <cell title="理想价格">{{ price }}元</cell>
  <cell title="所在位置" :value="location"></cell>
  <cell title="发布者" :value="itemusername"></cell>
  <cell title="联系方式" :value="contact"></cell>
  <card :header="{title:'物品详情'}">
    <p slot="content" class="card-padding">{{ description }}</p>
  </card>
  <card :header="{title:'物品图片'}">
    <img :src="image" slot="content" style="width:100%;height:auto" />
  </card>
  <template v-if="user === itemuser">
    <template v-if="status === 0">
      <x-button type="primary" text="交易完成" @click="finish"></x-button>
      <x-button type="default" text="提交回收" @click="receive"></x-button>
    </template>
  </template>
  <template v-else>
    <template v-if="status === 0 || (isAdmin && status === 1)">
      <x-button type="primary" text="联系物品主人" @click="contactMethods"></x-button>
    </template>
  </template>
  <template v-if="isAdmin && status === 1">
    <x-button type="primary" text="接受回收" @click="showDialog = true"></x-button>
    <x-button type="warn" text="拒绝回收" @click="showRefuse = true"></x-button>
  </template>
  <template v-if="isAdmin || user === itemuser">
    <x-button type="default" text="编辑物品" @click="editMethods"></x-button>
    <x-button type="warn" text="删除物品" @click="showConfirm = true"></x-button>
  </template>
  <x-button type="default" text="返回首页" @click="back"></x-button>
  <divider></divider>
  <divider></divider>
  <divider></divider>
  <toast :show.sync="showSuccess">提交成功</toast>
  <toast :show.sync="showCancel" type="cancel">提交失败</toast>
  <confirm :show.sync="showConfirm" title="删除确认" @on-confirm="delitem" confirm-text="确认" cancel-text="取消"><p style="text-align:center;">是否确定删除?</p></confirm>
  <div>
    <dialog :show.sync="showDialog" class="dialog-demo">
      <p class="dialog-title">接受回收</p>
      <group>
        <selector placeholder="请选择回收单位" title="回收单位" :options="grouplist" :value.sync="receiveGroup"></selector>
      </group>
      <x-button type="default" text="提交" @click="accept"></x-button>
      <span class="vux-close" @click="show=false"></span>
    </dialog>
  </div>
  <div>
    <dialog :show.sync="showRefuse" class="dialog-demo">
      <p class="dialog-title">拒绝回收</p>
      <x-input title="理由" name="name" placeholder="请输入理由" :value.sync="reason"></x-input>
      <x-button type="default" text="提交" @click="refuse"></x-button>
      <span class="vux-close" @click="show=false"></span>
    </dialog>
  </div>
</template>

<script>
import { Dialog, Cell, XHeader, XInput, XButton, Toast, Group, Card, Confirm, Rater, Divider, Selector, Badge } from 'vux/src/components'

export default {
  components: {
    Dialog,
    Cell,
    XHeader,
    XInput,
    XButton,
    Toast,
    Group,
    Card,
    Confirm,
    Rater,
    Divider,
    Selector,
    Badge
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      itemid: '',
      name: '',
      status: 0,
      description: '',
      contact: '',
      location: '',
      itemuser: '',
      itemusername: '',
      image: '',
      rate: 5,
      price: 1,
      lifetime: 0,
      group: '',
      isDisabled: false,
      showCancel: false,
      showSuccess: false,
      isLogin: false,
      showConfirm: false,
      user: '',
      isAdmin: false,
      showDialog: false,
      showRefuse: false,
      reason: '',
      grouplist: ['天津市旭世电子废弃物处理有限公司', '泰鼎(天津)环保科技有限公司', '天津市绿天使再生资源回收利用有限公司', '天津市东丽区科盛源电子产品经营部'],
      contactList: ['400-878-5157', '022-67160791', '022-27341983', '13642042577'],
      receiveGroup: '',
      receiveContact: ''
    }
  },
  ready () {
    this.isAdmin = window.userobj.get('admin')
    let Items = window.Bmob.Object.extend('items')
    // 创建查询对象，入口参数是对象类的实例
    let query = new window.Bmob.Query(Items)
    // 查询单条数据，第一个参数是这条数据的objectId值
    query.get(this.$route.params.id).then((object) => {
    // 查询成功，调用get方法获取对应属性的值
      this.itemid = object.id
      this.name = object.get('name')
      this.status = object.get('status')
      this.description = object.get('description')
      this.contact = object.get('contact')
      this.location = object.get('location')
      this.itemuser = object.get('user').id
      this.rate = object.get('rate')
      this.price = object.get('price')
      this.lifetime = object.get('lifetime')
      this.group = object.get('group')
      console.log(object.get('image'))
      query = new window.Bmob.Query(window.Bmob.User)
      query.get(object.get('user').id).then((man) => {
        this.itemusername = man.get('username')
      })
      window.Bmob.Image.thumbnail({'image': object.get('image')._url, 'mode': 0, 'quality': 100, 'width': 800}).then((obj) => {
        this.image = 'http://file.bmob.cn/' + obj.url
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
        object.set('status', 3)
        object.save()
        this.status = 3
        this.showSuccess = true
        // this.$router.go('/user')
        window.Bmob.Cloud.run('sendmsg', {'from': 'YZeiFFFI', 'to': window.user, 'content': '您的物品 ' + this.name + ' 的交易已被设为完成状态，感谢您的使用！'}).then((result) => {
          console.log(result)
        }, (error) => {
          console.log('Error!' + error)
        })
        window.Bmob.Cloud.run('sendmsg', {'from': window.user, 'to': 'YZeiFFFI', 'content': '物品 ' + this.name + ' 的交易已被报告完成！'}).then((result) => {
          console.log(result)
        }, (error) => {
          console.log('Error!' + error)
        })
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
        object.set('status', 1)
        object.save()
        this.showSuccess = true
        this.status = 1
        // this.$router.go('/user')
        window.Bmob.Cloud.run('sendmsg', {'from': 'YZeiFFFI', 'to': window.user, 'content': '您的物品 ' + this.name + ' 的回收单已提交，请等待回收单位受理！'}).then((result) => {
          console.log(result)
        }, (error) => {
          console.log('Error!' + error)
        })
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
        object.destroy((object) => {
          this.showSuccess = true
          this.$router.go('/')
          window.Bmob.Cloud.run('sendmsg', {'from': 'YZeiFFFI', 'to': window.user, 'content': '您的物品 ' + this.name + ' 已被删除，如不是本人操作，请立即联系客服进行申诉！'}).then((result) => {
            console.log(result)
          }, (error) => {
            console.log('Error!' + error)
          })
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
    accept: function () {
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
        for (let i = 0; i < this.grouplist.length; i++) {
          if (this.receiveGroup === this.grouplist[i]) {
            this.receiveContact = this.contactList[i]
          }
        }
        window.Bmob.Cloud.run('sendmsg', {'from': 'YZeiFFFI', 'to': window.user, 'content': '您的物品 ' + this.name + ' 的回收单已受理，回收单位是 ' + this.receiveGroup + '，联系电话：' + this.receiveContact + '，请保持电话畅通，回收单位将在72小时内与您商定回收细节！'}).then((result) => {
          console.log(result)
        }, (error) => {
          console.log('Error!' + error)
        })
        this.showDialog = false
        console.log('create object success, object id:' + object.id)
      }, (object, error) => {
        this.showCancel = true
        console.log('Error!' + error.code + ' ' + error.message)
      })
    },
    refuse: function () {
      let Items = window.Bmob.Object.extend('items')
      // 创建查询对象，入口参数是对象类的实例
      let query = new window.Bmob.Query(Items)
      // 查询单条数据，第一个参数是这条数据的objectId值
      query.get(this.$route.params.id).then((object) => {
      // 查询成功，调用get方法获取对应属性的值
        object.set('status', 0)
        object.save()
        this.showSuccess = true
        this.status = 0
        // this.$router.go('/user')
        window.Bmob.Cloud.run('sendmsg', {'from': 'YZeiFFFI', 'to': window.user, 'content': '您的物品 ' + this.name + ' 的回收单已被拒绝，原因是 ' + this.reason + '，如有疑问请向客服申诉！'}).then((result) => {
          console.log(result)
        }, (error) => {
          console.log('Error!' + error)
        })
        this.showRefuse = false
        console.log('create object success, object id:' + object.id)
      }, (object, error) => {
        this.showCancel = true
        console.log('Error!' + error.code + ' ' + error.message)
      })
    },
    back: function () {
      this.$router.go('/')
    },
    contactMethods: function () {
      this.$router.go('/chat/' + this.itemuser + '/' + this.$route.params.id)
    },
    editMethods: function () {
      this.$router.go('/edit/' + this.$route.params.id)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/close';
.card-padding {
  padding: 15px;
}
.dialog-demo {
  .weui_dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    height: 350px;
    overflow: hidden;
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
}
</style>