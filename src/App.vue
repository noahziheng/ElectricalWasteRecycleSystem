<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Hello World!'
      }
    },
    ready () {
      /* window.Bmob.User.logIn('noahziheng', 'adzd1005').then(function (user) {
        //login success
      }, function (user, error) {
        //login error
      })*/
    }
  }
</script>

<style lang="less">
    @import '~vux/src/styles/reset';
    body {
        background-color: #fbf9fe;
    }
</style>