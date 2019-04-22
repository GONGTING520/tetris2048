var DIAMOND_IMG_SRC = "/static/images/diamond"
/**
 * 定义一个方块类
 * @param index 初始化方块列表中的索引，用于随机生成方块
 */
export default function Common(index) {
    this.number = Math.pow(2, index);
    this.index = index;
    this.imgSrc = DIAMOND_IMG_SRC + index + ".png";
    this.x = 3;
    this.y = 0;
    this.visible = true;
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
Common.prototype.changeNumber = function () {
    this.index++;
    this.number = Math.pow(2, this.index);
    this.imgSrc = DIAMOND_IMG_SRC + this.index + ".png";

};
/**
 * 定义一个检测自身能否与下边界碰撞而停止的方法
 * 
 * @return bFlag 表示是否停止，true表示停止，false表示不停止
 */
Common.prototype.collisionBottom = function () {
    return this.y >= 6;
};
