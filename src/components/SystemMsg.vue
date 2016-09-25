<template>
	<div class="sys-wrap">
		<div class="sys-msg">
			{{msg}}
		</div>
	</div>
</template>
<script type="text/javascript">
export default {
  data () {
    return {}
  },
  ready () {
    this.$el.scrollIntoView()
  },
  props: ['msg']
}
</script>
<style lang='less'>
.sys-wrap{
	/*background-color: #fff;*/
	padding: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	word-wrap:break-word;
	word-break:break-all;
	text-align:center;
	.sys-msg{
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0,0,0,0.05);
		border-radius: 10px;
		min-width: 40%;
		color: #999;
		font-size: 12px;
		padding: 3px;
	}
}
</style>