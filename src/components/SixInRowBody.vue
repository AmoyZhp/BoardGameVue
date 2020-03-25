<template>
    <div class="row">
        <div class="col-lg-3">
            <SixInRowBodyLeftBar
                v-bind:start="start"
                v-bind:terminal="terminal"
                v-on:start-game="startGame"
                v-on:reset-game="resetGame"
            />
        </div>
        <div class="col-lg-6">
            <div class="row">
                <div class="col-lg-6">
                    <h5>
                        持方颜色 :
                        <span
                            class="badge badge-secondary"
                        >{{currentPlayer == config.PLAYER.BLACK ? '黑色' : '白色'}}</span>
                    </h5>
                </div>
                <div class="col-lg-6">
                    <button type="button" class="btn btn-primary" @click="requestHistory">加载对局</button>
                </div>
            </div>
            <SixInRowBodyBoard
                ref="board"
                v-bind:chessboard="chessboard"
                v-bind:player="currentPlayer"
                v-bind:start="start"
                v-bind:historyActions="historyActions"
                v-bind:timestep="timestep"
                v-bind:terminal="terminal"
                v-on:start-game="startGame"
                v-on:acting="acting"
                v-on:action-back="actionBack"
            ></SixInRowBodyBoard>
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
            start: false,
            //表示执方，主要用在人机对战的模式
            player: 0,
            disabled: false, // 用来操控是否要停止棋盘接受点击事件
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
        timestep: function(){
            return this.historyActions.length
        },
        //表示当前轮到了哪一方下棋
        currentPlayer: function(){
            console.log("in computed, len is " +  this.historyActions.length)
            if(this.historyActions.length == 0){
                return conf.PLAYER.BLACK
            }
            let lastAction = this.historyActions[this.historyActions.length-1]
            if(lastAction.player === conf.PLAYER.BLACK){
                return conf.PLAYER.WHITE
            } else {
                return conf.PLAYER.BLACK
            }
        },
        terminal: function(){
            if(this.isTerminal()){
                alert("游戏结束")
                return true
            } else {
                return false
            }
        }
    },
    mounted: function(){
        this.initPage()
    },
    methods:{
        acting: function(cachePos){
            if(this.start == false || this.terminal == true){
                return
            }
            this.actionCache.x1 = cachePos.x1
            this.actionCache.y1 = cachePos.y1
            this.actionCache.x2 = cachePos.x2
            this.actionCache.y2 = cachePos.y2
            this.actionCache.player = this.currentPlayer
            this.step(this.actionCache)
            if(this.terminal){
                this.requestEndGame()
            }
            // 如果是人机对战模式，则请求下一个行动
            if(this.mode == conf.MODE.HUMAN_TO_AI && this.terminal == false){
                console.log(this.currentPlayer)
                this.requestNextActon(this.currentPlayer)
            }
        },
        step(action){
            if(this.start == false || this.terminal == true){
                return
            }
            // 第一步时黑棋只走一个子
            if(this.timestep == 0){
                this.setStone(action.x1, action.y1, action.player)
                this.historyActions.push(new Action( action.player, action.x1, action.y1, -1, -1))
            } else {
                this.setStone(action.x1, action.y1, action.player)
                this.setStone(action.x2, action.y2, action.player)
                this.historyActions.push(new Action( action.player, action.x1, action.y1, action.x2, action.y2))
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
        async requestHistory(){
            try {
                this.resetGame()
                this.start = true
                this.mode = conf.MODE.HUMAN_TO_AI
                const response = await axios.get('http://127.0.0.1:8181/sixinrow/gethistorygame' 
                )
                let gameStateDTO = response.data.gameStateDTO
                let historyActions = gameStateDTO.historyActions;
                console.log(response)
                for(let i = 0; i < historyActions.length; i++){
                    let action = historyActions[i]
                    this.$refs.board.drawStone(action.x1,action.y1,action.player,i+1)
                    this.$refs.board.drawStone(action.x2,action.y2,action.player,i+1)
                    this.step(historyActions[i]);
                }
            } catch (error) {
                console.error(error)
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
            console.log(this.terminal)
            axios.post('http://127.0.0.1:8181/sixinrow/endgame',{
                requiredPlayer: this.currentPlayer,
                actionDTO: this.action,
                gameStateDTO: {
                    chessboard: this.chessboard,
                    timestep: this.timestep,
                    terminal:this.terminal,
                    historyActions: this.historyActions
                }
            }).then(function(response){
                that.start = false
                console.log(response)
            }).catch(function(error){
                console.log(error)
            })
        },
        async requestNextActon(requiredPlayer){
            if(this.start == false || this.terminal == true){
                return
            }
            try{
                const response = await axios.post('http://127.0.0.1:8181/sixinrow/getnextmove', {
                        requiredPlayer: requiredPlayer,
                        actionDTO: this.actionCache,
                        gameStateDTO: {
                            chessboard: this.chessboard,
                            timestep: this.timestep,
                            terminal: this.terminal,
                            historyActions: this.historyActions
                        }
                    })
                console.log(response)
                let actionDTO = response.data.actionDTO
                let action = new Action(actionDTO.player, actionDTO.x1, actionDTO.y1,
                                actionDTO.x2, actionDTO.y2)
                console.log(action)             
                this.step(action)
                this.$refs.board.drawStone(action.x1, action.y1, action.player, this.timestep)
                if(this.timestep != 1){
                    this.$refs.board.drawStone(action.x2, action.y2, action.player, this.timestep)
                }
            }catch(error){
                console.log(error)
                alert("服务端无连接")
                this.start = false
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
            this.mode = conf.MODE.HUMAN_TO_HUMAN
            this.stoneCnt = 0
            this.historyActions = []
            this.start = false
            this.$refs.board.resetGame();
        },
        startGame: function(player, mode){
            this.resetGame()
            this.start = true
            this.mode = mode        
            this.player = player
            if(mode == conf.MODE.HUMAN_TO_AI){
                let requiredPlayer = 0
                if(player == conf.PLAYER.WHITE){
                    requiredPlayer = conf.PLAYER.BLACK
                } else {
                    requiredPlayer = conf.PLAYER.WHITE
                }
                if(this.requestStartGame(requiredPlayer)){
                    if(player == conf.PLAYER.WHITE){
                        this.requestNextActon(conf.PLAYER.BLACK)
                    }
                } else {
                    console.log("游戏启动失败")
                }
            }
        },
        actionBack(step){
            //回退两步
            //假设当前是我方回合。那么则抹去对面的一步，以及我方的上一步（也就是我方想从新下的一步）
            if(this.historyActions.length - step >= 0){
                while(step-- > 0){
                    let action = this.historyActions.pop()
                    this.chessboard[action.x1][action.y1] = conf.PLAYER.EMPTY
                    this.chessboard[action.x2][action.y2] = conf.PLAYER.EMPTY
                }
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
        },
        isTerminal(){
            if(this.historyActions.length == 0){
                return false
            }
            let action = this.historyActions[this.historyActions.length-1]
            console.log(action)
            let player = action.player
            if(this.hasSixInRow(action.x1, action.y1, player)
                || this.hasSixInRow(action.x2, action.y2, player)){
                return true
            } else {
                return false
            }
        },
        hasSixInRow(x, y, player){
            if(x < 0 || x >= conf.BOARD_SIZE || y  < 0 || y >= conf.BOARD_SIZE){
                    return false
            }
            let cnt = 0
            // 横向
            cnt = 0
            for(let i = Math.max(0,x-5); i < Math.min(x+5, conf.BOARD_SIZE - 1); i++){
                if(this.chessboard[i][y] == player){
                    cnt++
                    if(cnt == 6){
                        return true
                    }
                } else {
                    cnt = 0
                }
            }
            // 纵向
            cnt = 0
            for(let i = Math.max(0,y-5); i < Math.min(y+5, conf.BOARD_SIZE - 1); i++){
                if(this.chessboard[x][i] == player){
                    cnt++
                    if(cnt == 6){
                        return true
                    }
                } else {
                    cnt = 0
                }
            }
            // 135 度
            cnt = 0
            for(let i = -5; i <= 5; i++){
                if(x+i < 0 || x+i >= conf.BOARD_SIZE || y+i < 0 || y+i >= conf.BOARD_SIZE){
                    continue
                }
                if(this.chessboard[x+i][y+i] == player){
                    cnt++
                    if(cnt == 6){
                        return true
                    }
                } else {
                    cnt = 0
                }
            }
            // 45 度
            cnt = 0
            for(let i = -5; i <= 5; i++){
                if(x+i < 0 || x+i >= conf.BOARD_SIZE || y+i < 0 || y+i >= conf.BOARD_SIZE){
                    continue
                }
                if(this.chessboard[x+i][y-i] == player){
                    cnt++
                    if(cnt == 6){
                        return true
                    }
                } else {
                    cnt = 0
                }
            }
            return false
        }
        
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