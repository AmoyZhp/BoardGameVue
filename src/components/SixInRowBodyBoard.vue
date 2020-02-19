<template>
</template>

<script>
import conf from "@/constant/SixInRowConsants.js"

export default {
  name: 'SixInRowBoard',
  props: {
    chessboard: {
      type: Array,
      default: [[]],
      required: true
    },
    player: {
      type: Number,
      default: conf.PLAYER.EMPTY,
    },
    disable: {
      type: Boolean,
      default: true,
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
    this.initPage()
  },
  methods: {
      initPage : function(){
          this.myCanvas = this.$refs.canvas
          this.myCanvas.width = conf.BOARD_PIXEL_SIZE
          this.myCanvas.height = conf.BOARD_PIXEL_SIZE
          this.myCanvasContenxt = this.myCanvas.getContext("2d")
      },
      chessboardClick: function(){

      },
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
