<template>
<div class="row">
    <div class="col-lg-3">
        <h5> Game Status : <span class="badge badge-secondary">{{start ? 'On' : 'Hold'}}</span></h5>
        <ul>
            <li v-for="(item, index) in historyMoves" :key="index">
                <div class="media">
                    <div class="media-body">
                        <strong class="mr-auto">Move : {{item.moveCnt}} Color : {{item.player == 1 ?  'Black' : 'White' }}</strong>
                        <ol>
                            <li>
                                x is : {{String.fromCharCode(item.x1+65)}} 
                                y is : {{String.fromCharCode(item.y1+65)}}
                            </li>
                            <li v-show="item.x2 != -1">
                                x is : {{String.fromCharCode(item.x2+65)}} 
                                y is : {{String.fromCharCode(item.y2+65)}}
                            </li>
                        </ol>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <div class="col-lg-6">
        <div class="row">
            <div class="col-lg-12">
                <canvas ref="canvas" class="chessboard" id="chessboard" @click="chessboardClick">
                </canvas>
            </div>
        </div>
        <div class="row" style="margin-top: 10px;">
            <div class="col-lg-5">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">Mode</label>
                    </div>
                    <select class="custom-select" v-model="mode">
                        <option value="0">人人对战</option>
                        <option value="1">人机对战</option>
                        <option value="2">机机对战</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">Player Side</label>
                    </div>
                    <select class="custom-select" v-model="currentPlayer" v-bind:disabled="start">
                        <option value="1">Black</option>
                        <option value="2">White</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-1 ">
                <button type="button" class="btn btn-primary"  @click="resetGame">Reset</button>
            </div>
            <div class="col-lg-1 ">
                <button type="button" class="btn btn-primary"  @click="startGame">Start</button>
            </div>
        </div>
    </div>
</div>

</template>

<script>
import conf from "@/constant/SixInRowConsants.js"

export default {
    name: "SixInRowBody",
    data: function(){
        return{
            historyMoves : [],
            chessboard : [],
            gridSize: 0,
            stoneCnt: 0,
            timestamp: 0,
            currentPlayer: conf.PLAYER.BLACK,
            plyaerOptions:[
                {
                    value: conf.PLAYER.BLACK,
                    name: 'Black',
                },
                {
                    alue: conf.PLAYER.WHITE,
                    name: 'White',
                }
            ],
            start: false,
            mode: conf.MODE.HUMAN_TO_HUMAN,
            modeOpions:[
                {
                    value:conf.MODE.HUMAN_TO_HUMAN,
                    name: '人人对战',
                },
                 {
                    value:conf.MODE.HUMAN_TO_AI,
                    name: '人机对战',
                },
                 {
                    value:conf.MODE.AI_TO_AI,
                    name: '智能对智能',
                }
            ]
        }
    },
    mounted: function(){
        this.initPage()
    },
    methods:{
        initPage: function(){
            this.myCanvas = this.$refs.canvas
            this.myCanvas.width = conf.BOARD_PIXEL_SIZE
            this.myCanvas.height = conf.BOARD_PIXEL_SIZE
            this.myCanvasContenxt = this.myCanvas.getContext("2d")
            for (let i = 0; i < conf.BOARD_SIZE; i++) {
                this.chessboard[i] = []
            }
            this.gridSize = conf.BOARD_PIXEL_SIZE / conf.BOARD_SIZE
            this.resetGame()
        },
        resetGame: function(){
            this.myCanvasContenxt.clearRect(0, 0, conf.BOARD_PIXEL_SIZE, conf.BOARD_PIXEL_SIZE);
            for (let i = 0; i < conf.BOARD_SIZE; i++) {
                for (let j = 0; j < conf.BOARD_SIZE; j++) {
                   this.chessboard[i][j] = conf.EMPTY
                }
            }
            this.currentPlayer = conf.PLAYER.BLACK
            this.mode = conf.MODE.HUMAN_TO_HUMAN
            this.stoneCnt = 0
            this.timestamp = 0
            this.historyMoves = []
            this.start = false
            this.drawChessboard()
            
        },
        drawChessboard : function(){
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
        startGame: function(){

        },
        chessboardClick: function(){

        },
    }
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