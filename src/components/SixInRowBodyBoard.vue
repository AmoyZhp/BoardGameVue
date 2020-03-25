<template>
    <div>
        <div class="row">
            <div class="col-lg-12">
                <canvas ref="canvas" class="chessboard" id="chessboard" @click="chessboardClick"></canvas>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <button type="button" class="btn btn-primary my-btn" @click="actionBack(1)">回退一步</button>
            </div>
            <div class="col-lg-6">
                <button type="button" class="btn btn-primary my-btn" @click="actionBack(2)">回退一轮</button>
            </div>
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
        historyActions: {
            type: Array,
            required: true
        },
        player: {
            type: Number,
            default: conf.PLAYER.EMPTY
        },
        timestep: {
            type: Number,
            default: 0,
            required: true
        },
        start: {
            type: Boolean,
            required: true
        },
        terminal:{
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
                y2: -1,
                player: conf.PLAYER.EMPTY
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
            if (this.start && this.terminal == false) {
                const { gridSize } = this;
                let ox = e.offsetX;
                let oy = e.offsetY;
                let x = Math.floor(ox / gridSize);
                let y = Math.floor(oy / gridSize);
                if (this.isLegalPos(x, y)) {
                    this.drawStone(x, y, this.player, this.timestep + 1);
                    this.stoneCnt++;
                    if (this.stoneCnt == 1) {
                        this.cachePos.x1 = x;
                        this.cachePos.y1 = y;
                        this.cachePos.player = this.player;
                        if (this.timestep == 0) {
                            this.$emit("acting", this.cachePos);
                            this.stoneCnt = 0;
                            this.cachePos.player = conf.PLAYER.EMPTY;
                        }
                    } else if (this.stoneCnt == 2) {
                        this.cachePos.x2 = x;
                        this.cachePos.y2 = y;
                        this.$emit("acting", this.cachePos);
                        this.stoneCnt = 0;
                        this.cachePos.player = conf.PLAYER.EMPTY;
                    }
                }
            }
        },
        stoneBack() {
            if (this.cachePos.player != conf.PLAYER.EMPTY) {
                this.resetGame();
                for (let i = 0; i < this.historyActions.length; i++) {
                    let action = this.historyActions[i];
                    this.drawStone(action.x1, action.y1, action.player, i + 1);
                    if (i != 0) {
                        this.drawStone(
                            action.x2,
                            action.y2,
                            action.player,
                            i + 1
                        );
                    }
                }
            }
        },
        actionBack(step) {
            // 如果当前已经落了一子，则回退一步
            if (this.cachePos.player != conf.PLAYER.EMPTY) {
                this.resetGame();
                for (let i = 0; i < this.historyActions.length; i++) {
                    let action = this.historyActions[i];
                    this.drawStone(action.x1, action.y1, action.player, i + 1);
                    if (i != 0) {
                        this.drawStone(
                            action.x2,
                            action.y2,
                            action.player,
                            i + 1
                        );
                    }
                }
            } else {
                //如果当前还未落子，说明想从新下自己的上一步
                //也就回退两步。即对方的一步，以及自己的上一步。
                this.$emit("action-back",step);
                this.resetGame();
                for (let i = 0; i < this.historyActions.length; i++) {
                    let action = this.historyActions[i];
                    this.drawStone(action.x1, action.y1, action.player, i + 1);
                    if (i != 0) {
                        this.drawStone(action.x2, action.y2, action.player, i + 1);
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
        drawStone: function(x, y, player, num) {
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
                num,
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
            this.cachePos.player = conf.PLAYER.EMPTY;
        },
        isLegalPos(x, y) {
            if (
                x < 0 ||
                x >= conf.BOARD_SIZE ||
                y < 0 ||
                y >= conf.BOARD_SIZE
            ) {
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
