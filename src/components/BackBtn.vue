/**
 * 游戏返回按钮组件
 */
<template>
    <img src="/static/images/back.png" width="10%" class="back" @click="goBack">
</template>

<script>
export default {
  name: 'BackBtn',
  data() {
    return {
    };
  },
  methods: {
    goBack () {
        this.$router.go(-1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.back{
  position: absolute;
  left: 15px;
  top: .5rem;
  cursor: pointer;
}
</style>
