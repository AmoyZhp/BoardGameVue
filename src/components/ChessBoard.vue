<template>
    <div class="row">
        <div class="col">
            <canvas ref="canvas" class="chessboard" id="chessboard" @click="boardClick"></canvas>
        </div>
    </div>
</template>
<script>

export default {
    mounted: function() {
        this.init();
    },
    watch: {
        historyActions: function(newValue, oldValue) {
            this.clearBoard();
            for (let i = 0; i < newValue.length; i++) {
                let action = newValue[i];
                this.renderStone(action.row, action.col, action.player, i + 1);
            }
        }
    },
    methods: {
        boardClick(e) {
            if (this.terminal) {
                return;
            }
            if (this.start == false) {
                this.$emit("start-game");
            }
            const { gridSize } = this;
            let ox = e.offsetX;
            let oy = e.offsetY;
            let row = Math.floor(oy / gridSize);
            let col = Math.floor(ox / gridSize);
            this.$emit("step", row, col);
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
        init() {
            this.HEIGHT = this.chessboard.length;
            this.WIDTH = this.chessboard[0].length;
            this.myCanvas = this.$refs.canvas;
            this.myCanvas.width = this.BOARD_PIXEL_SIZE;
            this.myCanvas.height = this.BOARD_PIXEL_SIZE;
            this.myCanvasContenxt = this.myCanvas.getContext("2d");
            this.gridSize = this.BOARD_PIXEL_SIZE / this.WIDTH;
            this.renderBoard();
        }
    },
    props: {
        BOARD_PIXEL_SIZE: {
            type: Number,
            required: true
        },
        playerOptions: {
            type: Object,
            required: true
        },
        terminal: {
            type: Boolean,
            required: true
        },
        start: {
            type: Boolean,
            required: true
        },
        chessboard: {
            type: Array,
            required: true,
            validator: function(value) {
                if (value.length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        historyActions:{
            type:Array,
            required:true
        }
    },
    data: function() {
        return {
            myCanvas: {},
            myCanvasContenxt: {},
            gridSize: 0,
            BLACK: this.playerOptions.BLACK.value,
            WHITE: this.playerOptions.WHITE.value,
            EMPTY: this.playerOptions.EMPTY.value
        };
    }
};
</script>