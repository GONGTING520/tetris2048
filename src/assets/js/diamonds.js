// 初始化方块
var newDiamonds = [{
    num: 2,
    color: 'yellow'
  }, {
    num: 4,
    color: 'yellow'
  }, {
    num: 8,
    color: 'yellow'
  }, {
    num: 16,
    color: 'yellow'
  }, {
    num: 32,
    color: 'yellow'
  }, {
    num: 64,
    color: 'yellow'
  }]
  
/**
 * 定义一个方块类
 * @param index 初始化方块列表中的索引，用于随机生成方块
 */
export default function Common(index) {
    this.number = newDiamonds[index].num;
    this.color = newDiamonds[index].color;
    this.x = 5;
    this.y = 1;
    this.bMovable = true; //记录是否存活
    this.speed = 1000;
}

// 定义一个下落一格的方法
Common.prototype.fallOne = function () {
    this.y++;
};

// 定义一个左移一格的方法
Common.prototype.moveLeft = function () {
    this.x--;
};

// 定义一个右移一格的方法
Common.prototype.moveRight = function () {
    this.x++;
};

// 定义一个修改数值的方法
Common.prototype.changeNumber = function (num) {
    this.number = num;
};
/**
 * 定义一个检测自身能否与下边界碰撞而停止的方法
 * 
 * @return bFlag 表示是否停止，true表示停止，false表示不停止
 */
Common.prototype.collisionBottom = function () {
    return this.y >= 10;
};
/**
 * 定义一个检测自身的下一个状态next与数组中元素target能否碰撞方法
 * 
 * @param {Array} next 表示自身下一个状态每一个方块的位置信息数组
 * @param {object} target 表示数组中的元素
 * @return bFlag 表示是否碰撞，true表示碰撞，false表示不碰撞
 */
Common.prototype.cover = function (next, target) {
    for (var i = 0; i < next.length; i++) {
        // 让target总每个div方块去比较下一个状态中的位置
        for (var j = 0; j < target.aDiv.length; j++) {
            if (Math.abs(next[i].top - target.aDiv[j].offsetTop) < target.iWidth) {
                if (Math.abs(next[i].left - target.aDiv[j].offsetLeft) < target.iWidth) {
                    return true;
                }
            }
        };
    }
    return false;
};
