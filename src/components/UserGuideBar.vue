<template>
    <div class="row">
        <div class="col">
            <div class="row my-2">
                <div class="col-lg-12">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <label class="input-group-text">选择持方</label>
                        </div>
                        <select class="custom-select" v-model="chosenPlayer" :disabled="start ">
                            <option
                                v-for="item in playerOptionsShow"
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
                <div class="col-lg-4">
                    <button type="button" class="btn btn-primary" @click="startGame">Start</button>
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <button type="button" class="btn btn-success my-btn" @click="actionBack">悔棋</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        start: {
            type: Boolean,
            required: true,
        },
        playerOptions:{
            type: Object,
            required: true,
        }
    },
    mounted: function(){
        this.$emit('set-player', this.chosenPlayer)
    },
    watch: {
        chosenPlayer: function(newValue, oldValue){
            this.$emit('set-player', newValue)
        }
    },
    methods: {
        resetGame() {
            this.$emit("reset-game");
        },
        startGame() {
            if(this.start == false){
                 this.$emit("start-game");
            }
        },
        actionBack() {
            if(this.start){
                this.$emit("action-back",{step:2});
            }
        }
    },
    computed: {
        playerOptionsShow : function(){
            return [this.playerOptions.BLACK, this.playerOptions.WHITE]
        }
    },
    data: function(){
        return {
            chosenPlayer: this.playerOptions.BLACK.value
        }
    }
};
</script>