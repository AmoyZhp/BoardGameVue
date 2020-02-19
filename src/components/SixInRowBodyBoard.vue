<template>
  <div class="row">
      <div class="col-lg-12">
          <canvas ref="canvas" class="chessboard" id="chessboard" @click="chessboardClick">
          </canvas>
      </div>
  </div>
</template>

<script>
import conf from "@/constant/SixInRowConsants.js"

export default {
  name: 'SixInRowBodyBoard',
  props: {
    chessboard: {
      type: Array,
      required: true
    },
    player: {
      type: Number,
      default: conf.PLAYER.EMPTY,
    },
    timestamp:{
      type: Number,
      default: 0,
    },
    start: {
      type: Boolean,
      required: true,
    }
  },
  data: function(){
    return {
      myCanvas: {},
      myCanvasContenxt: {},
      gridSize: 0,
    }
  },
  mounted: function(){
    this.init()
  },
  methods: {
      init: function(){
          this.myCanvas = this.$refs.canvas
          this.myCanvas.width = conf.BOARD_PIXEL_SIZE
          this.myCanvas.height = conf.BOARD_PIXEL_SIZE
          this.myCanvasContenxt = this.myCanvas.getContext("2d")
          this.gridSize = conf.BOARD_PIXEL_SIZE / conf.BOARD_SIZE
          this.drawChessboard()
      },
      chessboardClick: function(e){
        if(this.start){
            const{ gridSize } = this
            let ox = e.offsetX
            let oy = e.offsetY
            let x = Math.floor(ox / gridSize)
            let y = Math.floor(oy / gridSize)
            if(this.chessboard[x][y] == conf.PLAYER.EMPTY){
              this.drawStone(x, y, this.player)
            }
            this.$emit('set-stone',x, y, this.player)
        }
      },
      drawChessboard: function(){
          const { myCanvasContenxt } = this
          myCanvasContenxt.strokeStyle = '#bfbfbf'
          let begin = this.gridSize / 2;
          let end = conf.BOARD_PIXEL_SIZE - begin
          for (let i = 0; i < conf.BOARD_SIZE; i++) {
              myCanvasContenxt.moveTo(begin + i * this.gridSize, begin)
              myCanvasContenxt.lineTo(begin + i * this.gridSize, end)
              myCanvasContenxt.stroke()
              myCanvasContenxt.moveTo(begin, begin + i * this.gridSize)
              myCanvasContenxt.lineTo(end, begin + i * this.gridSize)
              myCanvasContenxt.stroke()
              myCanvasContenxt.fillText(String.fromCharCode(i+65), begin + i * this.gridSize - 1, 10)
              myCanvasContenxt.fillText(String.fromCharCode(i+65), 5, begin + i * this.gridSize + 2)
          }
      },
      drawStone: function(x, y, player){
            const { myCanvasContenxt } = this
            const { gridSize } = this
            let half = gridSize / 2
            myCanvasContenxt.beginPath()
            myCanvasContenxt.arc(half + x * gridSize, half + y * gridSize, 13, 0, 2 * Math.PI)
            myCanvasContenxt.closePath()
            if (player == conf.PLAYER.BLACK) {
                myCanvasContenxt.fillStyle = "#000000";
            } else {
                myCanvasContenxt.fillStyle = "#CCCCCC";
            }
            myCanvasContenxt.fill()
            if (player == conf.PLAYER.BLACK) {
                myCanvasContenxt.fillStyle = "#CCCCCC";
            } else {
                myCanvasContenxt.fillStyle = "#000000";
            }
            myCanvasContenxt.font = "bold";
            myCanvasContenxt.fillText(this.timestamp, half + x * gridSize - 3, half + y * gridSize + 3)
        },
        resetGame(){
          this.myCanvasContenxt.clearRect(0, 0, conf.BOARD_PIXEL_SIZE, conf.BOARD_PIXEL_SIZE)
          this.drawChessboard()
        }
  },
}
</script>

<style scoped>
.chessboard {
    display: block;
    box-shadow: -2px -2px 2px #efefef, 5px 5px 5px #B98989;
    margin-top: 10px;
    width: 570;
    height: 570;
}
</style>
