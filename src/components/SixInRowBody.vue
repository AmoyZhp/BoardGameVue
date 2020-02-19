<template>
<div class="row">
    <div class="col-lg-3">
        <SixInRowBodyLeftBar v-bind:start="start" 
                            v-on:start-game="startGame" 
                            v-on:reset-game="resetGame"/>
    </div>
    <div class="col-lg-6">
        <div class="row">
            <div class="col-lg-12">
                <h5> 持方颜色 : <span class="badge badge-secondary">{{player == config.PLAYER.BLACK ? '黑色' : '白色'}}</span></h5>
            </div>
        </div>
        <SixInRowBodyBoard ref="board" v-bind:chessboard="chessboard" 
                            v-bind:player="player" 
                            v-bind:start="start"
                            v-bind:timestamp="timestamp"
                            v-on:set-stone="setStone">
        </SixInRowBodyBoard>
    </div>
</div>

</template>

<script>
import conf from "@/constant/SixInRowConsants.js"
import SixInRowBodyBoard from "@/components/SixInRowBodyBoard.vue"
import SixInRowBodyLeftBar from "@/components/SixInRowBodyLeftBar.vue"
import Action from "@/model/Action"

export default {
    name: "SixInRowBody",
    components:{
        SixInRowBodyBoard,
        SixInRowBodyLeftBar
    },
    data: function(){
        return{
            historyActions : [],
            chessboard : [],
            stoneCnt: 0,
            timestamp:1,
            start: false,
            player: conf.PLAYER.BLACK,
            mode: conf.MODE.HUMAN_TO_HUMAN,
            action : new Action(),
            move: {
                x1:-1,
                y1:-1,
                x2:-1,
                y2:-1,
            },
            config: conf
        }
    },
    mounted: function(){
        this.initPage()
    },
    methods:{
        setStone: function(x, y, player){
            if(this.chessboard[x][y] == conf.PLAYER.EMPTY){
                this.chessboard[x][y] = player
                this.stoneCnt = (this.stoneCnt + 1) % 2
                // 第一步时黑棋只走一个子
                if(this.timestamp == 1){
                    this.historyActions.push(new Action(this.player, x, y, -1, -1))
                    this.stoneCnt = 0
                    this.player = conf.PLAYER.WHITE
                    this.timestamp++
                    
                } else {
                    // == 0 说明当前玩家已经走了两个子，该换边了
                    if(this.stoneCnt == 0){
                        this.historyActions.push(new Action(this.player, this.move.x1, this.move.y1,
                                                x, y))
                        this.changePlayer()
                        this.timestamp++
                        console.log(this.historyActions)
                    } else {
                        this.move.x1 = x
                        this.move.y1 = y
                    }
                }
            }
        },
        requestNextActon: function(){
            var that = this
            actionDto =  axios.post('http://127.0.0.1:8080//sixinrow/getnextmove', {
                    requiredPlayer: this.requiredPlayer,
                    actionDTO: {
                        "player": this.currentPlayer,
                        "x1": this.action.x1,
                        "y1": this.action.y1,
                        "x2": this.action.x2,
                        "y2": this.action.y2,
                    },
                    gameStateDTO: {
                        chessboard: this.chessboard,
                        timestamp: this.timestamp,
                        terminal: this.terminal,
                    }

                  })
                  .then(function (response) {
                    actionDTO = response.data.actionDTO
                    console.log(response);
                    that.setStone(actionDTO.x1, actionDTO.y1, that.requiredPlayer)
                    that.setStone(actionDTO.x2, actionDTO.y2, that.requiredPlayer)
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
        },
        initPage: function(){
            for (let i = 0; i < conf.BOARD_SIZE; i++) {
                this.chessboard[i] = []
            }
            this.resetGame()
        },
        resetGame: function(){
            for (let i = 0; i < conf.BOARD_SIZE; i++) {
                for (let j = 0; j < conf.BOARD_SIZE; j++) {
                   this.chessboard[i][j] = conf.PLAYER.EMPTY
                }
            }
            this.player = conf.PLAYER.BLACK
            this.mode = conf.MODE.HUMAN_TO_HUMAN
            this.stoneCnt = 0
            this.timestamp = 1
            this.historyActions = []
            this.start = false
            this.$refs.board.resetGame();
        },
        startGame: function(player, mode){
            if(this.start){
                this.resetGame()
            } 
            this.start = true
            this.player = player
            this.mode = mode
            this.timestamp = 1
        },
        changePlayer(){
            if(this.player == conf.PLAYER.BLACK){
                this.player = conf.PLAYER.WHITE
            } else {
                this.player = conf.PLAYER.BLACK
            }
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