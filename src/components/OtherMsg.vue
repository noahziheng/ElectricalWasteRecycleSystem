<template>
<div class="other-wrap">
  <span class="-header" style="background-color:#fff"><img :src="img" style="width:50px;height:50px;border-radius:100px;" /></span>
  <!--<span class="-name">{{name}}</span>-->
  <div class="-msg">{{msg}}</div>
</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  ready () {
    this.$el.scrollIntoView()
  },
  props: ['msg', 'img', 'color']
}
</script>
<style lang='less'>
.other-wrap{
  /*background-color: #666;*/
  padding: 5px 5px 0 5px;
  overflow: hidden;
  position: relative;
  .-header{
  	position: relative;
  	left: 10px;
    top: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #905;
    height:50px;
    width: 50px;
    border-radius: 50%;
    font-weight: bolder;
  }/*
  .-name{
    background-color: #fff;
    position: absolute;
    font-size: 14px;
    padding: 2px;
    margin: 0 10px;
    color: #999;
  }*/
  .-msg{
    display: inline-flex;
    background-color: #fff;
    padding: 10px;
    position: relative;
    left: 20px;
    top: -10px;
    border-radius: 6px;
    max-width: ~'calc(100% - 180px)';
    font-size: 16px;
    word-wrap:break-word;
    word-break:break-all;
    &:before{
      content:'';
      display: inline-block;
      height: 0;
      width: 0;
      border-right: solid 10px #fff;
      border-top: solid 6px transparent;
      border-bottom : solid 6px transparent;
      position: absolute;
      top:5px;
      left: -8px;
    }
  }
}
</style>