<template>
  <ul class="list">
    <li @click="newGame">单机模式</li>
    <li @click="infiniteSchema">无限模式</li>
    <li @click="timeSchema">计时模式</li>
    <li @click="challengeSchema">闯关模式</li>
  </ul>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
    };
  },
  methods: {
    // 新游戏
    newGame(){
      this.$router.push('/new');
    },
    // 无限模式
    infiniteSchema(){
      this.$router.push('/infiniteSchema');
    },
    // 计时模式
    timeSchema(){
      this.$router.push('/timeSchema');
    },
    // 闯关模式
    challengeSchema(){},
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list{
  width: 7.5rem;
  height: 100%;
  padding: 2rem 0 3.6rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.list li{
  width: 5.6rem;
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  font-size: .5rem;
  border: .1rem solid #000;
  cursor: pointer;
}
</style>
