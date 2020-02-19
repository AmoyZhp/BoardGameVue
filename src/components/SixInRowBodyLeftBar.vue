<template>
    <div>
        <div class="row">
            <div class="col-lg-12">
                <h5> Game Status : <span class="badge badge-secondary">{{start ? '开始' : '等待'}}</span></h5>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">Mode</label>
                    </div>
                    <select class="custom-select" v-model="mode" >
                        <option v-for="item in modeOptions" 
                            v-bind:value="item.value" 
                            :key="item.value">{{item.name}}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">Player</label>
                    </div>
                    <select class="custom-select" v-model="player" :disabled="mode == config.MODE.HUMAN_TO_HUMAN" >
                        <option v-for="item in playerOptions" 
                            v-bind:value="item.value" 
                            :key="item.value">{{item.name}}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <button type="button" class="btn btn-primary"  @click="resetGame">Reset</button>
            </div>
            <div class="col-lg-6">
                <button type="button" class="btn btn-primary my-btn" @click="startGame">Start</button>
            </div>
        </div>
    </div>
</template>
<script>
import conf from "@/constant/SixInRowConsants.js"

export default {
    name: "SixInRowBodyLeftBar",
    props: {
        start: {
            type: Boolean,
            default: false
        }
    },
    data: function(){
        return {
            player: 1,
            mode: 0,
            config: conf,
            modeOptions:[
                {
                    value:conf.MODE.HUMAN_TO_HUMAN,
                    name:'人人对战'
                },
                {
                    value:conf.MODE.HUMAN_TO_AI,
                    name:'人机对战'
                },
                {
                    value:conf.MODE.AI_TO_AI,
                    name:'智能对战智能'
                },
            ],
            playerOptions:[
                {
                    value:conf.PLAYER.BLACK,
                    name:'黑方'
                },
                {
                    value:conf.PLAYER.WHITE,
                    name:'白方'
                },
            ]
        }
    },
    methods: {
        resetGame(){
            this.$emit('reset-game')
        },
        startGame(){
            this.$emit('start-game', this.player, this.mode)
        }
    }
}
</script>

<style scoped>
.btn {
    margin: 5px;
}
.input-group {
    margin: 5px;
}
</style>