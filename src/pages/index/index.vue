<template>
  <div class="container">
    <ul class="list">
      <li @click="newGame" class="single"></li>
      <li @click="infiniteSchema" class="infinite"></li>
      <li @click="timeSchema" class="timer"></li>
      <li @click="challengeSchema" class="level"></li>
    </ul>
    <img src="/static/images/introduce.png" class="introduce" @click="introduce" style="cursor:pointer">
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn.vue';

export default {
  name: 'Index',
  data() {
    return {
    };
  },
  mounted(){
  },
  components: {
    BackBtn
  },
  methods: {
    playBgm(){
      window.bgm.playBgm()
    },
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
    challengeSchema(){
      this.$router.push('/challengeSchema');
    },
    // 游戏介绍
    introduce(){
      this.$router.push('/introduce');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container{
  position: relative;
  width: 100%;
  height: 100%;
  background: url(/static/images/homebg.jpg) no-repeat 0 0/100% 100%;
}
.introduce{
  position: absolute;
  right: 6%;
  bottom: 80%;
  width: 20%;
  cursor: pointer;
}
.list{
  position: absolute;
  top: 0;
  left: 0;
  width: 7.5rem;
  height: 100%;
  padding: 2.8rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.list li{
  width: 5rem;
  height: 1.6rem;
  cursor: pointer;
}
.single{
  background: url(/static/images/single.png) no-repeat 0 0/100% 100%;
}
.infinite{
  background: url(/static/images/infinite.png) no-repeat 0 0/100% 100%;
}
.timer{
  background: url(/static/images/timer.png) no-repeat 0 0/100% 100%;
}
.level{
  background: url(/static/images/level.png) no-repeat 0 0/100% 100%;
}
</style>
