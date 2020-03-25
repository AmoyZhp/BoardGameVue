<template>
    <div class="row">
        <div class="col-lg-12">
            <canvas ref="canvas" class="chessboard" id="chessboard" @click="boardClick"></canvas>
        </div>
    </div>
</template>
<script>
import GomokuAction from "@/model/GomokuAction"

export default {
    mounted: function() {
        this.init();
    },
    props: {
        chessboard: {
            type: Array,
            required: true
        },
        historyActions: {
            type: Array,
            required: true
        },
    },
    data: function() {
        return {
            myCanvas: {},
            myCanvasContenxt: {},
            BOARD_PIXEL_SIZE: this.$store.state.gomoku.BOARD_PIXEL_SIZE,
            WIDTH: this.$store.state.gomoku.WIDTH,
            HEIGHT: this.$store.state.gomoku.HEIGHT,
            BLACK: this.$store.state.gomoku.PLAYER_OPTIONS.BLACK,
            WHITE: this.$store.state.gomoku.PLAYER_OPTIONS.WHITE,
            EMPTY: this.$store.state.gomoku.PLAYER_OPTIONS.EMPTY,
            gridSize: 0,
        };
    },
    watch: {
        historyActions: function(newValue, oldValue) {
            this.clearBoard();
            for (let i = 0; i < newValue.length; i++) {
                let action = newValue[i];
                this.renderStone(action.row, action.col, action.player, action.timestep);
            }
        }
    },
    methods: {
        init() {
            this.myCanvas = this.$refs.canvas;
            this.myCanvas.width = this.BOARD_PIXEL_SIZE;
            this.myCanvas.height = this.BOARD_PIXEL_SIZE;
            this.myCanvasContenxt = this.myCanvas.getContext("2d");
            this.gridSize = this.BOARD_PIXEL_SIZE / this.WIDTH;
            this.renderBoard();
        },
        boardClick(e) {
            if (this.$store.state.gomoku.terminal) {
                return;
            }
            if (this.$store.state.gomoku.start == false) {
                this.$emit("start-game");
            }
            const { gridSize } = this;
            let ox = e.offsetX;
            let oy = e.offsetY;
            let row = Math.floor(oy / gridSize);
            let col = Math.floor(ox / gridSize);
            this.$emit('step',row, col)
        },
        renderBoard() {
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
                myCanvasContenxt.fillText(i, begin + i * this.gridSize - 5, 10);
                myCanvasContenxt.fillText(i, 5, begin + i * this.gridSize + 2);
            }
        },
        renderStone(row, col, player, number) {
            const { gridSize } = this;
            const { myCanvasContenxt } = this;
            let half = gridSize / 2;
            myCanvasContenxt.beginPath();
            myCanvasContenxt.arc(
                half + col * gridSize,
                half + row * gridSize,
                13,
                0,
                2 * Math.PI
            );
            myCanvasContenxt.closePath();
            if (player == this.BLACK) {
                myCanvasContenxt.fillStyle = "#000000";
            } else {
                myCanvasContenxt.fillStyle = "#CCCCCC";
            }
            myCanvasContenxt.fill();
            if (player == this.BLACK) {
                myCanvasContenxt.fillStyle = "#CCCCCC";
            } else {
                myCanvasContenxt.fillStyle = "#000000";
            }
            myCanvasContenxt.font = "bold";
            myCanvasContenxt.fillText(
                number,
                half + col * gridSize - 3,
                half + row * gridSize + 3
            );
        },
        clearBoard() {
            this.myCanvasContenxt.clearRect(
                0,
                0,
                this.BOARD_PIXEL_SIZE,
                this.BOARD_PIXEL_SIZE
            );
            this.renderBoard();
        },
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