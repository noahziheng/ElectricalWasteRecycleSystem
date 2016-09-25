<template>
  <x-header :left-options="{showBack: false}" :right-options="{showMore: true}"  @on-click-more="showMenus = true">待交易列表</x-header>
  <scroller lock-x scrollbar-y use-pullup use-pulldown :height="scrollHeight" @pullup:loading="loadMore" @pulldown:loading="refresh" :pullup-status.sync="pullupStatus" :pulldown-config="pulldownConfig" v-ref:scroller>
    <group>
      <template v-for="item in items">
        <cell :title="item.name" :inline-desc="item.location" is-link :link="'/detail/' + item.id"><badge style="background:#e64340;font-size:13px;" slot="after-title" :text="item.group"></badge>￥ {{ item.price }}</cell>
      </template>
    </group>
    <!--pullup slot-->
    <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
      <span v-show="pullupStatus === 'default'"></span>
      <span class="pullup-arrow" v-show="pullupStatus === 'down' || pullupStatus === 'up'" :class="{'rotate': pullupStatus === 'up'}">↑</span>
      <span v-show="pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
    </div>
  </scroller>
    <divider></divider>
    <divider></divider>
    <divider></divider>
  <actionsheet :menus="menus" :show.sync="showMenus" show-cancel @on-click-menu="click" cancel-text="取消"></actionsheet>
  <alert :show.sync="show" title="联系我们" button-text="知道了">
    <p style="text-align:center;">如有使用问题，请发送邮件到<br>noahgaocn@gmail.com</p>
    <p style="text-align:center;">如有交易、回收问题，请联系<br>天津科技大学<br>电子信息与自动化学院<br>青年志愿者协会<br>微信公众号TUSTDX志协</p>
  </alert>
</template>

<script>
import { Cell, XHeader, Actionsheet, Alert, Divider, Group, Badge, Scroller, Spinner } from 'vux/src/components'

export default {
  components: {
    Cell,
    XHeader,
    Actionsheet,
    Alert,
    Divider,
    Group,
    Badge,
    Spinner,
    Scroller
  },
  data () {
    return {
      menus: {
        menu2: '联系我们'
      },
      showMenus: false,
      show: false,
      items: [],
      itemcount: 0,
      pointer: 0,
      query: {},
      pullupStatus: 'default',
      pulldownConfig: {
        content: '下拉刷新',
        height: 60,
        autoRefresh: false,
        downContent: '继续下拉',
        upContent: '松开刷新',
        loadingContent: '加载中...'
      },
      scrollHeight: document.body.clientHeight - 96 + 'px'
    }
  },
  created () {
    let Items = window.Bmob.Object.extend('items')
    this.query = new window.Bmob.Query(Items)
    this.query.count().then((count) => {
    // 查询成功，返回记录数量
      this.itemcount = count
      this.items = []
      this.dataget()
    })
  },
  methods: {
    click (key) { // 更多ActionSheet点击
      if (key === 'menu2') {
        this.show = true
        console.log('Show Feedback')
      } else {
        console.log(key)
      }
    },
    dataget () { // 加载数据
      if (this.pointer < this.itemcount) {
        this.query.limit(10)
        this.query.skip(this.pointer)
        this.pointer += 10
        this.query.equalTo('status', 0)
        this.query.ascending('createdAt')
        // 查询所有数据
        this.query.find().then((results) => {
          for (let i = 0; i < results.length; i++) {
            let object = results[i]
            let tmp = {
              id: object.id,
              name: object.get('name'),
              location: object.get('location'),
              price: object.get('price'),
              group: object.get('group')
            }
            this.items.push(tmp)
          }
        }, (error) => {
          console.log('查询失败: ' + error.code)
        })
      }
    },
    loadMore (uuid) {
      console.log(uuid)
      this.dataget()
      this.$nextTick(() => {
        this.$broadcast('pullup:reset', uuid)
      })
    },
    refresh (uuid) {
      console.log(uuid)
      this.query.count().then((count) => {
      // 查询成功，返回记录数量
        this.itemcount = count
        this.pointer = 0
        this.items = []
        this.dataget()
      })
      this.$nextTick(() => {
        this.$broadcast('pulldown:reset', uuid)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box2-wrap {
  height: 300px;
  overflow: hidden;
}
.rotate {
  display: inline-block;
  transform: rotate(-180deg);
}
.pullup-arrow {
  transition: all linear 0.2s;
  color: #666;
  font-size: 25px;
}
</style>