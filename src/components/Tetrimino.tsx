// Tetriminoの形を定義する
// 7種類のTetriminoの形を定義する
// それぞれのTetriminoは4つのMinoで構成される
// Minoはx, y座標を持つ
// また、それぞれのTetriminoは回転させることができる

export interface ITetrimino {
  direction: number;
  lock: boolean;
  // patternの一つは[x,y][x,y][x,y][x,y]の4つのMinoで構成される
  pattern: number[][][];
  rotate: () => void;
}

// Tetriminoの形を定義する
// 7種類のTetriminoの形を定義する

export const I: ITetrimino = {
  direction: 0,
  lock: false,
  pattern: [
    [[0, 0], [1, 0], [2, 0], [3, 0]],
    [[1, 0], [1, 1], [1, 2], [1, 3]]
  ],
  rotate: function() {
    this.direction = (this.direction + 1) % 2;
  }
}

export const O: ITetrimino = {
  direction: 0,
  lock: true,
  pattern: [
    [[0, 0], [1, 0], [0, 1], [1, 1]]
  ],
  rotate: function() {}
}

export const S: ITetrimino = {
  direction: 0,
  lock: false,
  pattern: [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[0, 0], [0, 1], [1, 1], [1, 2]]
  ],
  rotate: function() {
    this.direction = (this.direction + 1) % 2;
  }
}

export const Z: ITetrimino = {
  direction: 0,
  lock: false,
  pattern: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[1, 0], [0, 1], [1, 1], [0, 2]]
  ],
  rotate: function() {
    this.direction = (this.direction + 1) % 2;
  }
}

export const J: ITetrimino = {
  direction: 0,
  lock: false,
  pattern: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [1, 0], [0, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1]],
    [[1, 0], [1, 1], [0, 2], [1, 2]]
  ],
  rotate: function() {
    this.direction = (this.direction + 1) % 4;
  }
}

export const L: ITetrimino = {
  direction: 0,
  lock: false,
  pattern: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [0, 2], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [0, 1]],
    [[0, 0], [1, 0], [1, 1], [1, 2]]
  ],
  rotate: function() {
    this.direction = (this.direction + 1) % 4;
  }
}

export const T: ITetrimino = {
  direction: 0,
  lock: false,
  pattern: [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 1], [0, 2]],
    [[0, 0], [1, 0], [2, 0], [1, 1]],
    [[1, 0], [0, 1], [1, 1], [1, 2]]
  ],
  rotate: function() {
    this.direction = (this.direction + 1) % 4;
  }
}
