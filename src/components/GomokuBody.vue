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
                        <select class="custom-select" v-model="mode">
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
                            :disabled="mode == modeOptions[0].value"
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
            <GomokuBodyBoard />
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
    computed: {
        start: {
            get(){
                return this.$store.state.gomoku.start
            },
            set(value){
                this.$store.commit({
                    type: 'gomoku/setStart',
                    start: value
                })
            }
        },
        mode:{
            get(){
                return this.$store.state.gomoku.mode
            },
            set(value){
                this.$store.commit({
                    type: 'gomoku/setMode',
                    mode: value
                })
            },
        },
    },
    data: function() {
        return {
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
        }
    },
    methods:{
        resetGame(){
            
        },
        startGame(){

        },
        actionBack(){

        },
    }
};
</script>