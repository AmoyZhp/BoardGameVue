<template>
    <div class="row">
        <div class="col-lg-3">
            <div class="row mt-2">
                <div class="col-lg-12">
                    <h5>
                        Game Status :
                        <span class="badge badge-secondary">{{start ? '开始' : '等待'}}</span>
                    </h5>
                </div>
            </div>
            <div class="row my-2">
                <div class="col-lg-12">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Mode</label>
                        </div>
                        <select class="custom-select" v-model="mode" :disabled="start">
                            <option
                                v-for="item in modeOptions"
                                v-bind:value="item.value"
                                :key="item.value"
                            >{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row my-2">
                <div class="col-lg-12">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Player</label>
                        </div>
                         
                        <select
                            class="custom-select" 
                            v-model="player" 
                            :disabled="mode == modeOptions[0].value || start "
                        >
                            <option
                                v-for="item in playerOptions"
                                v-bind:value="item.value"
                                :key="item.value"
                            >{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row my-1">
                <div class="col-lg-6">
                    <button type="button" class="btn btn-primary" @click="resetGame">Reset</button>
                </div>
                <div class="col-lg-6">
                    <button type="button" class="btn btn-primary my-btn" @click="actionBack">回退一步</button>
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <GomokuBodyBoard 
                v-bind:chessboard="chessboard" 
                v-bind:historyActions="historyActions" 
                v-on:step="step"
                v-on:start-game="startGame"
            />
        </div>
        <div class="col-lg-3"></div>
    </div>
</template>
<script>
import GomokuBodyBoard from "@/components/GomokuBodyBoard.vue";

export default {
    components: {
        GomokuBodyBoard
    },
    beforeCreate: function(){
        this.$store.commit('gomoku/initState')
    },
    mounted: function(){
        this.$store.commit('gomoku/reset')
    },
    watch: {
        historyActions: function(newValue, oldValue) {
            if(newValue.length > 0){
                let action = newValue[newValue.length-1]
                let terminal = this.hasFiveInRow(action.row, action.col, action.player)
                this.$store.commit({
                    type: 'gomoku/setTerminal',
                    terminal: terminal
                })
                if(terminal){
                    if(action.player == this.BLACK){
                        alert("Black Side Win!")
                    } else {
                        alert("White Side Win!")
                    }
                    
                }
                
            }
        }
    },
    methods:{
        step(row, col){
            if(this.isLegalPos(row, col)) {
                this.$store.commit({
                    type:'gomoku/step',
                    row:row,
                    col:col,
                })
            }
            if(this.mode == this.$store.state.gomoku.MODE_OPTIONS.HUMAN_TO_AI){
                this.$store.dispatch('gomoku/requestNextAction')
            }
        },
        resetGame(){
            this.$store.commit('gomoku/reset')
        },
        startGame(){
            this.resetGame()
            this.$store.commit({
                type: 'gomoku/setTerminal',
                terminal: false,
            })
            this.$store.commit({
                type: 'gomoku/setStart',
                start: true,
            })
        },
        actionBack(){
            this.$store.commit('gomoku/actionBack')
        },
        hasFiveInRow(row, col, player){
            if(row < 0 || row >= this.HEIGHT || col  < 0 || col >= this.WIDTH){
                    return false
            }
            let cnt = 0
            // 纵向
            cnt = 0
            for(let i = Math.max(0,row-4); i < Math.min(row+5, this.HEIGHT); i++){
                if(this.chessboard[i][col] == player){
                    cnt++
                    if(cnt == 5){
                        return true
                    }
                } else if(this.chessboard[i][col] != this.EMPTY){
                    cnt = 0
                }
            }
            // 横向
            cnt = 0
            for(let i = Math.max(0,col-4); i < Math.min(col+5, this.WIDTH); i++){
                if(this.chessboard[row][i] == player){
                    cnt++
                    if(cnt == 5){
                        return true
                    }
                } else if(this.chessboard[row][i] != this.EMPTY){
                    cnt = 0
                }
            }
            // 135 度
            cnt = 0
            for(let i = -4; i <= 4; i++){
                if(row+i < 0 || row+i >= this.WIDTH || col+i < 0 || col+i >= this.HEIGHT){
                    continue
                }
                if(this.chessboard[row+i][col+i] == player){
                    cnt++
                    if(cnt == 5){
                        return true
                    }
                } else if(this.chessboard[row+i][col+i] != this.EMPTY){
                    cnt = 0
                }
            }
            // 45 度
            cnt = 0
            for(let i = -4; i <= 4; i++){
                let x = row - i
                let y = col + i
                if(y < 0 || y>= this.WIDTH || x < 0 || x >= this.HEIGHT){
                    continue
                }
                if(this.chessboard[x][y] == player){
                    cnt++
                    if(cnt == 5){
                        return true
                    }
                } else if(this.chessboard[x][y] != this.EMPTY){
                    cnt = 0
                }
            }
            return false
        },
        isLegalPos(row, col) {
            if (row < 0 || row >= this.HEIGHT ||
                    col < 0 ||col >= this.WIDTH){
                return false;
            }
            if (this.chessboard[row][col] != this.EMPTY) {
                return false;
            }
            return true;
        }
    },
    computed: {
        start: {
            get(){
                return this.$store.state.gomoku.start
            }
        },
        terminal:{
            get(){
                return this.$store.state.gomoku.terminal
            }
        },
        historyActions: {
            get(){
                return this.$store.state.gomoku.historyActions
            }
        },
        chessboard: {
            get(){
                return this.$store.state.gomoku.chessboard
            }
        },
    },
    data: function() {
        return {
            mode: this.$store.state.gomoku.MODE_OPTIONS.HUMAN_TO_HUMAN,
            player: this.$store.state.gomoku.PLAYER_OPTIONS.BLACK,
            modeOptions:[
                {
                    value:this.$store.state.gomoku.MODE_OPTIONS.HUMAN_TO_HUMAN,
                    name:'人人对战'
                },
                {
                    value:this.$store.state.gomoku.MODE_OPTIONS.HUMAN_TO_AI,
                    name:'人机对战'
                },
                {
                    value:this.$store.state.gomoku.MODE_OPTIONS.AI_TO_AI,
                    name:'智智对战'
                }
            ],
            playerOptions:[
                {
                    value:this.$store.state.gomoku.PLAYER_OPTIONS.BLACK,
                    name:'黑方'
                },
                {
                    value:this.$store.state.gomoku.PLAYER_OPTIONS.WHITE,
                    name:'白方'
                },
            ],
            BOARD_PIXEL_SIZE: this.$store.state.gomoku.BOARD_PIXEL_SIZE,
            WIDTH: this.$store.state.gomoku.WIDTH,
            HEIGHT: this.$store.state.gomoku.HEIGHT,
            BLACK: this.$store.state.gomoku.PLAYER_OPTIONS.BLACK,
            WHITE: this.$store.state.gomoku.PLAYER_OPTIONS.WHITE,
            EMPTY: this.$store.state.gomoku.PLAYER_OPTIONS.EMPTY,
        }
    },
};
</script>