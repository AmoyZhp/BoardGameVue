<template>
    <div class="row">
        <div class="col-lg-12">
            <canvas ref="canvas" class="chessboard" id="chessboard" @click="boardClick"></canvas>
        </div>
    </div>
</template>
<script>
export default {
    mounted: function(){
        this.init()
    },
    data : function(){
        return{
            BOARD_PIXEL_SIZE : this.$store.state.gomoku.BOARD_PIXEL_SIZE,
            WIDTH : this.$store.state.gomoku.WIDTH,
            HEIGHT: this.$store.state.gomoku.HEIGHT,
            gridSize: 0,
        }
    },
    methods:{
        init(){
            this.myCanvas = this.$refs.canvas;
            this.myCanvas.width = this.BOARD_PIXEL_SIZE
            this.myCanvas.height = this.BOARD_PIXEL_SIZE
            this.myCanvasContenxt = this.myCanvas.getContext("2d");
            this.gridSize = this.BOARD_PIXEL_SIZE / this.WIDTH;
            this.renderBoard()
        },
        boardClick(){

        },
        renderBoard(){
            const { myCanvasContenxt } = this;
            myCanvasContenxt.strokeStyle = "#bfbfbf";
            let begin = this.gridSize / 2;
            let end = this.BOARD_PIXEL_SIZE - begin;
            for (let i = 0; i < this.WIDTH; i++) {
                myCanvasContenxt.moveTo(begin + i * this.gridSize, begin);
                myCanvasContenxt.lineTo(begin + i * this.gridSize, end);
                myCanvasContenxt.stroke();
                myCanvasContenxt.moveTo(begin, begin + i * this.gridSize);
                myCanvasContenxt.lineTo(end, begin + i * this.gridSize);
                myCanvasContenxt.stroke();
                myCanvasContenxt.fillText(
                    i,
                    begin + i * this.gridSize - 5,
                    10
                );
                myCanvasContenxt.fillText(
                    i,
                    5,
                    begin + i * this.gridSize + 2
                );
            }
        },
        renderStone(x, y, player, number){

        },
        clearBoard(){
             this.myCanvasContenxt.clearRect(
                0,
                0,
                this.BOARD_PIXEL_SIZE,
                this.BOARD_PIXEL_SIZE
            );
            this.renderBoard()
        },

    }
}
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