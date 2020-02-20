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
                            v-on:acting="acting">
        </SixInRowBodyBoard>
    </div>
</div>

</template>

<script>
import conf from "@/constant/SixInRowConsants.js"
import SixInRowBodyBoard from "@/components/SixInRowBodyBoard.vue"
import SixInRowBodyLeftBar from "@/components/SixInRowBodyLeftBar.vue"
import Action from "@/model/Action"
import axios from 'axios'


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
            terminal: false,
            disabled: false, // 用来操控是否要停止棋盘接受点击事件
            player: conf.PLAYER.BLACK,
            mode: conf.MODE.HUMAN_TO_HUMAN,
            action : new Action(),
            actionCache: new Action(),
            move: {
                x1:-1,
                y1:-1,
                x2:-1,
                y2:-1,
            },
            config: conf
        }
    },
    computed: {
        requiredPlayer: function () {
            if(this.player == conf.PLAYER.BLACK){
                return conf.PLAYER.WHITE
            } else {
                return conf.PLAYER.BLACK
            }
        }
    },
    mounted: function(){
        this.initPage()
    },
    methods:{
        acting: function(cachePos){
            this.actionCache.x1 = cachePos.x1
            this.actionCache.y1 = cachePos.y1
            this.actionCache.x2 = cachePos.x2
            this.actionCache.y2 = cachePos.y2
            this.actionCache.player = this.player
            this.step(this.actionCache)
            // 如果是人机对战模式，则请求下一个行动
            if(this.mode == conf.MODE.HUMAN_TO_AI){
                this.requestNextActon(this.requiredPlayer)
            } else if(this.mode == conf.MODE.HUMAN_TO_HUMAN){
                // 如果是人人对战 那就交换当前的行动权
                this.changePlayer()
            }
        },
        step(action){
            // 第一步时黑棋只走一个子
            if(this.timestamp == 0){
                this.setStone(action.x1, action.y1, action.player)
                this.historyActions.push(action)
                this.timestamp++
            } else {
                this.setStone(action.x1, action.y1, action.player)
                this.setStone(action.x2, action.y2, action.player)
                this.historyActions.push(action)
                this.timestamp++
            }
        },
        setStone: function(x, y, player){
            if(this.isLegalPos(x,y)){
                this.chessboard[x][y] = player
                return true
            } else {
                console.log('非法位置: ' + x + " " + y)
                return false
            }

        },
        async requestStartGame(requiredPlayer){
            try {
                const response = await axios.get('http://127.0.0.1:8181/sixinrow/startgame',{ 
                    params: {
                        requiredPlayer: requiredPlayer,
                    } 
                })
                if(response.data.code == 2000){
                    console.log('成功了！')
                    return true
                } else {
                    console.log('失败了！')
                    return false
                }
            } catch (error) {
                console.error(error)
                return false
            }
        },
        requestEndGame(){
            var that = this
            axios.post('ttp://127.0.0.1:8181/sixinrow/endgame',{
                requiredPlayer: this.player,
                actionDTO: this.action,
                gameStateDTO: {
                    chessboard: this.chessboard,
                    timestamp: this.timestamp,
                    terminal:true,
                }
            }).then(function(response){
                that.start = false
            }).catch(function(error){
                console.log(error)
            })
        },
        async requestNextActon(requiredPlayer){
            try{
                const response = await axios.post('http://127.0.0.1:8181//sixinrow/getnextmove', {
                        requiredPlayer: requiredPlayer,
                        actionDTO: this.actionCache,
                        gameStateDTO: {
                            chessboard: this.chessboard,
                            timestamp: this.timestamp,
                            terminal: this.terminal,
                        }
                    })
                console.log(response)
                let actionDTO = response.data.actionDTO
                let action = new Action(actionDTO.player, actionDTO.x1, actionDTO.y1,
                                actionDTO.x2, actionDTO.y2)
                console.log(action)             
                this.step(action)
                this.$refs.board.drawStone(action.x1, action.y1, action.player)
                if(this.timestamp != 1){
                    this.$refs.board.drawStone(action.x2, action.y2, action.player)
                }
            }catch(error){
                console.log(error)
            }        
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
            this.resetGame()
            this.start = true
            this.player = player
            this.mode = mode
            this.timestamp = 0
            if(mode == conf.MODE.HUMAN_TO_AI){
                if(this.requestStartGame(this.requiredPlayer)){
                    if(this.player == conf.PLAYER.WHITE){
                        this.requestNextActon(this.requiredPlayer)
                    }
                } else {
                    console.log("游戏启动失败")
                }
            }
        },
        changePlayer(){
            if(this.player == conf.PLAYER.BLACK){
                this.player = conf.PLAYER.WHITE
            } else {
                this.player = conf.PLAYER.BLACK
            }
        },
        isLegalPos(x, y){
            if(x < 0 || x >= conf.BOARD_SIZE || y < 0 || y >= conf.BOARD_SIZE){
                return false
            }
            if(this.chessboard[x][y] != conf.PLAYER.EMPTY){
                console.log('非法位置: 在哪里 ' + x + " " + y)
                return false
            }
            return true
        }
        
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