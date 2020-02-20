<template>
  <div class="row">
    <div class="col-lg-12">
      <canvas ref="canvas" class="chessboard" id="chessboard" @click="chessboardClick"></canvas>
    </div>
  </div>
</template>

<script>
import conf from "@/constant/SixInRowConsants.js";

export default {
  name: "SixInRowBodyBoard",
  props: {
    chessboard: {
      type: Array,
      required: true
    },
    player: {
      type: Number,
      default: conf.PLAYER.EMPTY
    },
    timestamp: {
      type: Number,
      default: 0,
      required: true
    },
    start: {
      type: Boolean,
      required: true
    }
  },
  data: function() {
    return {
      myCanvas: {},
      myCanvasContenxt: {},
      gridSize: 0,
      stoneCnt: 0,
      cachePos: {
        x1: -1,
        y1: -1,
        x2: -1,
        y2: -1
      }
    };
  },
  mounted: function() {
    this.init();
  },
  methods: {
    init: function() {
      this.myCanvas = this.$refs.canvas;
      this.myCanvas.width = conf.BOARD_PIXEL_SIZE;
      this.myCanvas.height = conf.BOARD_PIXEL_SIZE;
      this.myCanvasContenxt = this.myCanvas.getContext("2d");
      this.gridSize = conf.BOARD_PIXEL_SIZE / conf.BOARD_SIZE;
      this.drawChessboard();
    },
    chessboardClick: function(e) {
      if (this.start) {
        const { gridSize } = this;
        let ox = e.offsetX;
        let oy = e.offsetY;
        let x = Math.floor(ox / gridSize);
        let y = Math.floor(oy / gridSize);
        if (this.isLegalPos(x, y)) {
          this.drawStone(x, y, this.player);
          this.stoneCnt++;
          if (this.stoneCnt == 1) {
            this.cachePos.x1 = x;
            this.cachePos.y1 = y;
            if (this.timestamp == 0) {
              this.$emit("acting", this.cachePos);
              this.stoneCnt = 0;
            }
          } else if (this.stoneCnt == 2) {
            this.cachePos.x2 = x;
            this.cachePos.y2 = y;
            this.$emit("acting", this.cachePos);
            this.stoneCnt = 0;
          }
        }
      }
    },
    drawChessboard: function() {
      const { myCanvasContenxt } = this;
      myCanvasContenxt.strokeStyle = "#bfbfbf";
      let begin = this.gridSize / 2;
      let end = conf.BOARD_PIXEL_SIZE - begin;
      for (let i = 0; i < conf.BOARD_SIZE; i++) {
        myCanvasContenxt.moveTo(begin + i * this.gridSize, begin);
        myCanvasContenxt.lineTo(begin + i * this.gridSize, end);
        myCanvasContenxt.stroke();
        myCanvasContenxt.moveTo(begin, begin + i * this.gridSize);
        myCanvasContenxt.lineTo(end, begin + i * this.gridSize);
        myCanvasContenxt.stroke();
        myCanvasContenxt.fillText(
          String.fromCharCode(i + 65),
          begin + i * this.gridSize - 1,
          10
        );
        myCanvasContenxt.fillText(
          String.fromCharCode(i + 65),
          5,
          begin + i * this.gridSize + 2
        );
      }
    },
    drawStone: function(x, y, player) {
      const { myCanvasContenxt } = this;
      const { gridSize } = this;
      let half = gridSize / 2;
      myCanvasContenxt.beginPath();
      myCanvasContenxt.arc(
        half + x * gridSize,
        half + y * gridSize,
        13,
        0,
        2 * Math.PI
      );
      myCanvasContenxt.closePath();
      if (player == conf.PLAYER.BLACK) {
        myCanvasContenxt.fillStyle = "#000000";
      } else {
        myCanvasContenxt.fillStyle = "#CCCCCC";
      }
      myCanvasContenxt.fill();
      if (player == conf.PLAYER.BLACK) {
        myCanvasContenxt.fillStyle = "#CCCCCC";
      } else {
        myCanvasContenxt.fillStyle = "#000000";
      }
      myCanvasContenxt.font = "bold";
      myCanvasContenxt.fillText(
        this.timestamp,
        half + x * gridSize - 3,
        half + y * gridSize + 3
      );
    },
    resetGame() {
      this.myCanvasContenxt.clearRect(
        0,
        0,
        conf.BOARD_PIXEL_SIZE,
        conf.BOARD_PIXEL_SIZE
      );
      this.drawChessboard();
      this.stoneCnt = 0;
    },
    isLegalPos(x, y) {
      if (x < 0 || x >= conf.BOARD_SIZE || y < 0 || y >= conf.BOARD_SIZE) {
        return false;
      }
      if (this.chessboard[x][y] != conf.PLAYER.EMPTY) {
        return false;
      }
      if (
        this.stoneCnt != 0 &&
        x == this.cachePos.x1 &&
        y == this.cachePos.y1
      ) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
.chessboard {
  display: block;
  box-shadow: -2px -2px 2px #efefef, 5px 5px 5px #b98989;
  margin-top: 10px;
  width: 570;
  height: 570;
}
</style>
