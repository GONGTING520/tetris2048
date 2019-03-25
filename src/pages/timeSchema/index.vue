<template>
  <div>
    <div class="best-score">最长时间：{{longestTime}}</div>
    <div class="score">时间：{{keepTime}}</div>
    <div class="playground" ref="playground">
      <span class="diamond" v-if="this.fallingDiamond" :style="getDiamondStyle(this.fallingDiamond)" v-text="this.fallingDiamond.number"></span>
      <span class="diamond" :style="getDiamondStyle(item)" v-for="(item, index) in diamonds" :key="index" v-text="item.number"></span>
    </div>
    <div class="game-over" v-if="this.isGameOver">
      <p class="game-over-txt">GAME OVER</p>
      <p class="game-over-score">最终坚持时间：{{keepTime}}</p>
      <div class="btn restart" @click="restartGame">重新开始</div>
      <router-link class="btn home" to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script>
import Diamond from'../../assets/js/diamonds';

export default {
  name: 'NewGame',
  data() {
    return {
      longestTime: 0,
      startTime: 0,
      endTime: 0,
      width: 0,
      diamonds: [],
      fallingDiamond: null, //正在下落的方块
      isTapUpdate: false, //是否由点击触发updated
      mergeTime: 800,
      isNeedNew: false, // 是否需要新建方块
      isGameOver: false, // 是否游戏结束
      needRemerge: [] // fallingDiamond merge完成后需要merge的其余变更方块
    };
  },
  computed: {
    keepTime(){
      var leadTime = new Date(this.endTime - this.startTime);
      var hours = leadTime.getHours() - 8;
      var minute = leadTime.getMinutes();
      var second = leadTime.getSeconds();
      var str = hours > 0 ? hours + 'h' : '';
      str += minute > 0 ? minute + 'm' : '';
      str += second + 's';
      return str;
    }
  },
  mounted(){
    this.startTime = new Date();
    // 小方块的宽度
    this.width = this.$refs.playground.offsetWidth / 10;
    this.newDiamond(); // 初始化新方块
    this.addEvent(); // 添加监听事件
  },
  updated(){
    if (this.fallingDiamond == null || this.needRemerge.length > 0 || this.isTapUpdate || this.isNeedNew){
      return;
    }
    console.log('update');
    setTimeout(() => {
      this.endTime = new Date();
      // 如果方块可以继续移动
      if (this.judgeFallingMove()) {
        this.fallingDiamond.fallOne();
      } else {
        if (!this.isNeedNew) {
          this.isNeedNew = true;
        }
        if (this.fallingDiamond.y == 1 && this.fallingDiamond.x == 5) {
          this.mergeDiamonds(() => {
            if (this.fallingDiamond.y == 1 && this.fallingDiamond.x == 5) {
              this.isGameOver = true;
              this.diamonds.push(this.fallingDiamond);
              this.fallingDiamond = null;
            } else {
              // console.log('no move new');
              this.newDiamond();
            }
          });
          return;
        }
        this.mergeDiamonds(this.newDiamond);
      }
      this.isTapUpdate = false;
    }, this.fallingDiamond.speed);
  },
  methods: {
    // 获取小方块样式
    getDiamondStyle(elem){
      var style = {
        left: (elem.x - 1) * this.width + 'px',
        top: (elem.y - 1) * this.width + 'px',
        width: this.width + 'px',
        height: this.width + 'px',
        lineHeight: this.width + 'px',
        background: elem.color
      };
      return style;
    },
    // 生成新方块
    newDiamond(){
      console.log('new');
      this.endTime = new Date();
      if (this.fallingDiamond){
        this.diamonds.push(this.fallingDiamond);
      }
      var index = Math.floor(Math.random() * 6);
      this.fallingDiamond = new Diamond(index);
      this.isNeedNew = false;
    },
    // 添加监听事件
    addEvent(){
      document.onkeydown = function(e){
        this.isTapUpdate = true;
        switch (e.keyCode) {
          case 37: //左
            if (this.fallingDiamond.x <= 1){
              return;
            }
            var bIsCanMoveLeft = true;
            this.diamonds.forEach(element => {
              // 当前方块不能继续左移
              if (element.y == this.fallingDiamond.y && element.x == this.fallingDiamond.x - 1) {
                bIsCanMoveLeft = false;
              }
            });
            if (bIsCanMoveLeft) {
              this.fallingDiamond.moveLeft();
            }
            break;
          case 38: //上
            break;
          case 39: //右
            if (this.fallingDiamond.x >= 10){
              return;
            }
            var bIsCanMoveRight = true;
            this.diamonds.forEach(element => {
              // 当前方块不能继续左移
              if (element.y == this.fallingDiamond.y && element.x == this.fallingDiamond.x + 1) {
                bIsCanMoveRight = false;
              }
            });
            if (bIsCanMoveRight) {
              this.fallingDiamond.moveRight();              
            }
            break;
          case 40: //下
            if (this.fallingDiamond.y >= 10 || !this.judgeFallingMove()){
              return;
            }
            this.fallingDiamond.fallOne();
            break;
        }
      }.bind(this);
    },
    // 判断当前方块是否可以继续下落
    judgeFallingMove(){
      // 判断当前方块是否落到底部
      var bIsCanMove = !this.fallingDiamond.collisionBottom();
      if (bIsCanMove == false) {
        return bIsCanMove;
      }
      this.diamonds.forEach(element => {
        // 当前方块不能继续下落
        if (element.x == this.fallingDiamond.x && element.y == this.fallingDiamond.y + 1) {
          bIsCanMove = false;
        }
      });
      return bIsCanMove;
    },
    // 合并相邻方块
    mergeDiamonds(callback){
      setTimeout(() => {
        this.endTime = new Date();
        var res = this.diamonds.some((elem, index) => {
          if (elem.number == this.fallingDiamond.number) {
            // 向下合并
            if (elem.x == this.fallingDiamond.x && elem.y == this.fallingDiamond.y + 1) {
              this.diamondFallDown(this.fallingDiamond.x, this.fallingDiamond.y); // 让x，y坐标以上的方块下落
              this.fallingDiamond.fallOne();
              this.fallingDiamond.changeNumber(this.fallingDiamond.number + elem.number);
              console.log(index, "down", this.diamonds.length);
              this.diamonds.splice(index, 1);
              console.log(this.diamonds.length);
              return true;
            }
            // 向左合并
            if (elem.x == this.fallingDiamond.x - 1 && elem.y == this.fallingDiamond.y) {
              this.diamondFallDown(this.fallingDiamond.x, this.fallingDiamond.y); // 让x，y坐标以上的方块下落
              this.fallingDiamond.moveLeft();
              this.fallingDiamond.changeNumber(this.fallingDiamond.number + elem.number);              
              console.log(index, "left", this.diamonds.length);
              this.diamonds.splice(index, 1);
              console.log(this.diamonds.length);
              return true;
            }
            // 向右合并
            if (elem.x == this.fallingDiamond.x + 1 && elem.y == this.fallingDiamond.y) {
              this.diamondFallDown(elem.x, elem.y); // 让x，y坐标以上的方块下落
              elem.moveLeft();
              this.fallingDiamond.changeNumber(this.fallingDiamond.number + elem.number);              
              console.log(index, "right", this.diamonds.length);
              this.diamonds.splice(index, 1);
              console.log(this.diamonds.length);
              return true;
            }
            // 向上合并
            if (elem.x == this.fallingDiamond.x && elem.y + 1 == this.fallingDiamond.y) {
              this.diamondFallDown(elem.x, elem.y); // 让x，y坐标以上的方块下落
              elem.fallOne();
              this.fallingDiamond.changeNumber(this.fallingDiamond.number + elem.number);              
              console.log(index, "up", this.diamonds.length);
              this.diamonds.splice(index, 1);
              console.log(this.diamonds.length);
              return true;
            }
          }
        });
        if (res) {
          console.log('merge');
          this.mergeDiamonds(callback);
        } else {
          if (this.needRemerge.length < 1) {
            callback && callback();
          } else {
            console.log('remerge');
            this.needRemerge.sort((a, b) => {
              return b.y - a.y;
            });
            this.diamonds.push(this.fallingDiamond);
            this.fallingDiamond = this.needRemerge.shift();
            this.mergeDiamonds(callback);
          }
        }
      }, this.mergeTime);
    },
    diamondFallDown(x, y){
      this.diamonds.forEach(elem => {
        if (elem.x == x && elem.y < y) {
          this.needRemerge.push(elem);
          elem.fallOne();
        }
      })
    },
    restartGame(){
      window.location.reload();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.best-score{
  padding-top: 1rem;
  padding-right: .5rem;
  text-align: right;
}

.score{
  padding-right: .5rem;
  padding-bottom: .7rem;
  text-align: right;
}

.playground{
  width: 7rem;
  height: 7rem;
  margin: 0 auto;
  position: relative;
  background: #cccccc;
}

.diamond{
  position: absolute;
  text-align: center;
  font-size: .25rem;
}

.game-over{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
}

.game-over-txt{
  margin-top: 3rem;
  font-size: 1rem;
  text-align: center;
  color: #ffffff;
}

.game-over-score{
  font-size: .5rem;
  text-align: center;
  color: #ffffff;
}

.btn{
  display: block;
  width: 3rem;
  margin: 0 auto;
  text-align: center;
  color: #ffffff;
  font-size: .5rem;
  cursor: pointer;
  border: 1px solid #ffffff;
}

.restart{
  margin-top: 2rem;
  margin-bottom: .8rem;
}
</style>
