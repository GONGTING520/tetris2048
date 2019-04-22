<template>
  <div class="container">
    <div class="level">第 {{level}} 关</div>
    <div class="score">得分：{{score}}</div>
    <div class="playground" ref="playground">
      <span class="diamond" v-if="this.fallingDiamond" :style="getDiamondStyle(this.fallingDiamond)"></span>
      <span v-for="(item, index) in diamonds" :key="index">
        <span v-if="diaItem.visible" class="diamond" :style="getDiamondStyle(diaItem)"  v-for="(diaItem, index) in item" :key="'dia'+index"></span>
      </span>
    </div>
    <BackBtn></BackBtn>
    <div class="game-over" v-if="this.isGameOver">
      <p class="game-over-txt">GAME OVER</p>
      <p class="game-over-score">最终得分：{{score}}</p>
      <div class="btn restart" @click="restartGame">重新开始</div>
      <router-link class="btn home" to="/">返回首页</router-link>
    </div>
    <BackBtn></BackBtn>
  </div>
</template>

<script>
import Diamond from'../../assets/js/diamonds';
import BackBtn from '@/components/BackBtn';

export default {
  name: 'NewGame',
  data() {
    return {
      score: 0,
      level: 1, // 当前关卡
      width: 0,
      diamonds: this.getTwoDimensionArray(7, 7),
      fallingDiamond: null, //正在下落的方块
      isTapUpdate: false, //是否由点击触发updated
      mergeTime: 600,
      downTime: 800,
      isNeedNew: false, // 是否需要新建方块
      isGameOver: false, // 是否游戏结束
      needRemerge: [] // fallingDiamond merge完成后需要merge的其余变更方块
    };
  },
  mounted(){
    // 小方块的宽度
    this.width = this.$refs.playground.offsetWidth / 7;
    this.newDiamond(); // 初始化新方块
    this.addEvent(); // 添加监听事件
  },
  components: {
    BackBtn
  },
  updated(){
    if (this.fallingDiamond == null || this.needRemerge.length > 0 || this.isTapUpdate || this.isNeedNew){
      return;
    }
    console.log('update');
    setTimeout(() => {
      // 如果方块可以继续移动
      if (this.judgeFallingMove()) {
        this.fallingDiamond.fallOne();
      } else {
        if (!this.isNeedNew) {
          this.isNeedNew = true;
          this.score += this.fallingDiamond.number;
          if (this.score >= 5000 * this.level) {
            this.level++
            window.bgm.playLevelUpBgm();
            this.downTime -= 200;
            this.mergeTime -= 200;
            if (this.downTime < 400) {
              this.downTime = 400;
            }
            if (this.mergeTime < 400) {
              this.mergeTime = 400;
            }
          }
        }
        if (this.fallingDiamond.y == 0 && this.fallingDiamond.x == 3) {
          this.mergeDiamonds(() => {
            if (this.fallingDiamond.y == 0 && this.fallingDiamond.x == 3) {
              this.isGameOver = true;
              this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x] = this.fallingDiamond;
              this.fallingDiamond = null;
            } else {
              this.newDiamond();
            }
          });
          return;
        }
        this.mergeDiamonds(this.newDiamond);
      }
      this.isTapUpdate = false;
    }, this.downTime);
  },
  methods: {
    /**
     * 获取二维数组
     * @param {Number} x: 二维数组横坐标-每一层中内容的长度
     * @param {Number} y: 二维数组纵坐标-第一层的长度
     * @return {Array}: 返回一个 x * y 的二维数组
     */
    getTwoDimensionArray(x, y) {
      let array = new Array(y)

      for(let i = 0 ; i < y ; i++){
        array[i] = new Array(x).fill(0)
      }
      
      return array
    },
    // 获取小方块样式
    getDiamondStyle(elem){
      var style = {
        left: elem.x * this.width + 'px',
        top: elem.y * this.width + 'px',
        width: this.width + 'px',
        height: this.width + 'px',
        lineHeight: this.width + 'px',
        background: 'url(' + elem.imgSrc + ') no-repeat center/100% 100%'
      };
      return style;
    },
    // 生成新方块
    newDiamond(){
      console.log('new');
      if (this.fallingDiamond){
        this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x] = this.fallingDiamond;
      }
      var index = Math.ceil(Math.random() * 6);
      this.fallingDiamond = new Diamond(index);
      this.isNeedNew = false;
    },
    // 添加监听事件
    addEvent(){
      document.onkeydown = function(e){
        this.isTapUpdate = true;
        switch (e.keyCode) {
          case 37: //左
            if (this.fallingDiamond.x <= 0){
              return;
            }
            if (this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x - 1] == 0) {
              this.fallingDiamond.moveLeft();
            }
            break;
          case 38: //上
            break;
          case 39: //右
            if (this.fallingDiamond.x >= 6){
              return;
            }
            if (this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x + 1] == 0) {
              this.fallingDiamond.moveRight();              
            }
            break;
          case 40: //下
            if (this.fallingDiamond.y >= 6 || !this.judgeFallingMove()){
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
      return this.diamonds[this.fallingDiamond.y + 1][this.fallingDiamond.x] == 0
    },
    // 合并相邻方块
    mergeDiamonds(callback){
      setTimeout(() => {
        if (this.fallingDiamond.y < 6) {
          let downDiamond = this.diamonds[this.fallingDiamond.y + 1][this.fallingDiamond.x]
          if (!!downDiamond && downDiamond.number == this.fallingDiamond.number) {
            // 下方可以合并
            downDiamond.visible = false
            this.diamonds[this.fallingDiamond.y + 1][this.fallingDiamond.x] = 0
            this.fallingDiamond.changeNumber()
            this.fallingDiamond.fallOne()
            this.diamonds[this.fallingDiamond.y - 1][this.fallingDiamond.x] = 0

            window.bgm.playMergeBgm()

            // 向下移动后，将原位置上方的所有方块下落一格
            for (let i = this.fallingDiamond.y - 2; i >= 0; i--) {
              let topDiamond = this.diamonds[i][this.fallingDiamond.x]
              if (!!topDiamond) {
                topDiamond.fallOne()

                this.diamonds[i + 1][this.fallingDiamond.x] = topDiamond
                this.diamonds[i][this.fallingDiamond.x] = 0

                this.needRemerge.push(topDiamond)
              }
            }

            this.mergeDiamonds(callback);
            return
          }
        }

        // 检测上方方块是否可以合并
        if (this.fallingDiamond.y > 0) {
          let topDiamonds = this.diamonds[this.fallingDiamond.y - 1][this.fallingDiamond.x]
          if (!!topDiamonds && topDiamonds.number == this.fallingDiamond.number) {
            // 上方可以合并
            topDiamonds.visible = false
            this.diamonds[this.fallingDiamond.y - 1][this.fallingDiamond.x] = 0
            this.fallingDiamond.changeNumber()

            window.bgm.playMergeBgm()

            // 向下移动后，将原位置上方的所有方块下落一格
            for (let i = this.fallingDiamond.y - 2; i >= 0; i--) {
              let topDiamond = this.diamonds[i][this.fallingDiamond.x]
              if (!!topDiamond) {
                topDiamond.fallOne()

                this.diamonds[i + 1][this.fallingDiamond.x] = topDiamond
                this.diamonds[i][this.fallingDiamond.x] = 0

                this.needRemerge.push(topDiamond)
              }
            }

            this.mergeDiamonds(callback);
            return
          }
        }

        // 检测左侧方块是否可以合并
        if (this.fallingDiamond.x > 0) {
          let leftDiamond = this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x - 1]
          if (!!leftDiamond && leftDiamond.number == this.fallingDiamond.number) {
            // 左侧可以合并
            leftDiamond.visible = false
            this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x - 1] = 0
            this.fallingDiamond.changeNumber()

            window.bgm.playMergeBgm()

            // 左侧方块向右移动后，将原位置上方的所有方块下落一格
            for (let i = this.fallingDiamond.y - 1; i >= 0; i--) {
              let leftTopDiamond = this.diamonds[i][this.fallingDiamond.x - 1]
              if (!!leftTopDiamond) {
                leftTopDiamond.fallOne()

                this.diamonds[i + 1][this.fallingDiamond.x - 1] = leftTopDiamond
                this.diamonds[i][this.fallingDiamond.x - 1] = 0

                this.needRemerge.push(leftTopDiamond)
              }
            }

            this.mergeDiamonds(callback);
            return
          }
        }

        // 检测右侧方块是否可以合并
        if (this.fallingDiamond.x < 6) {
          let rightDiamond = this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x + 1]
          if (!!rightDiamond && rightDiamond.number == this.fallingDiamond.number) {
            // 右侧可以合并
            rightDiamond.visible = false
            this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x + 1] = 0
            this.fallingDiamond.changeNumber()

            window.bgm.playMergeBgm()

            // 将右上方的所有方块下落一格
            for (let i = this.fallingDiamond.y - 1; i >= 0; i--) {
              let rightTopDiamond = this.diamonds[i][this.fallingDiamond.x + 1]
              if (!!rightTopDiamond) {
                rightTopDiamond.fallOne()

                this.diamonds[i + 1][this.fallingDiamond.x + 1] = rightTopDiamond
                this.diamonds[i][this.fallingDiamond.x + 1] = 0

                this.needRemerge.push(rightTopDiamond)
              }
            }

            this.mergeDiamonds(callback);
            return
          }
        }

        // 如果需要merge的list中有元素
        if (this.needRemerge.length) {
          this.diamonds[this.fallingDiamond.y][this.fallingDiamond.x] = this.fallingDiamond
          
          // 将已经合并过的元素剔除
          do{
            this.fallingDiamond = this.needRemerge.shift()
          } while (this.fallingDiamond && !this.isCanMerge(this.fallingDiamond))

          if (!this.fallingDiamond) {
            callback && callback()
            return
          }

          this.mergeDiamonds(callback);
          return
        }
        
        callback && callback()
      }, this.mergeTime);
    },
    isCanMerge(item) {
      if (!item.visible) {
        return false
      }

      // 左侧可以合并
      if (item.x > 0 && this.diamonds[item.y][item.x - 1] != 0) {
        if (item.number == this.diamonds[item.y][item.x - 1].number) {
          return true
        }
      }

      // 右侧可以合并
      if (item.x < 6 && this.diamonds[item.y][item.x + 1] != 0) {
        if (item.number == this.diamonds[item.y][item.x + 1].number) {
          return true
        }
      }

      // 上方可以合并
      if (item.y > 0 && this.diamonds[item.y - 1][item.x] != 0) {
        if (item.number == this.diamonds[item.y - 1][item.x].number) {
          return true
        }
      }

      // 下方可以合并
      if (item.y < 6 && this.diamonds[item.y + 1][item.x] != 0) {
        if (item.number == this.diamonds[item.y + 1][item.x].number) {
          return true
        }
      }

      return false
    },
    restartGame(){
      window.location.reload();
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
  background: url(/static/images/gamebg.jpg) no-repeat 0 0/100% 100%;
}

.level{
  padding-top: 1.4rem;
  color: #ffffff;
  font-weight: bold;
  font-size: .42rem;
  text-align: center;
}

.score{
  padding-left: .5rem;
  padding-bottom: .3rem;
  color: #ffffff;
  font-weight: bold;
  font-size: .36rem;
}

.playground{
  width: 7rem;
  height: 7rem;
  margin: 0 auto;
  position: relative;
  background: url(/static/images/ground.png) no-repeat 0 0/100% 100%;
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
  z-index: 1;
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
