<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <div class="col">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">DEBUG</span>
                            </div>
                            <select class="custom-select" v-model="debug">
                                <option v-bind:value="true">true</option>
                                <option v-bind:value="false">false</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <label class="input-group-text">模式</label>
                                </div>
                                <select
                                    class="custom-select"
                                    v-model="chosenMode"
                                    :disabled="start || !debug"
                                >
                                    <option
                                        v-for="item in modeOptions"
                                        v-bind:value="item.value"
                                        :key="item.value"
                                    >{{item.name}}</option>
                                </select>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">AB depth</span>
                                </div>
                                <input type="text" class="form-control" v-model="abDepth"  :disabled="!debug"/>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">TSS depth</span>
                                </div>
                                <input type="text" class="form-control" v-model="tssDepth" :disabled="!debug" />
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">搜索时间</span>
                                </div>
                                <input type="text" class="form-control" v-model="timeLimit" :disabled="!debug" />
                                <div class="input-group-append">
                                    <span class="input-group-text">s</span>
                                </div>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">搜索算法</span>
                                </div>
                                <select class="custom-select" v-model="AItype" :disabled="!debug">
                                    <option value="0">Alpha Beta</option>
                                    <option value="1">Threat Space Search</option>
                                </select>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    mounted: function() {
        this.updateDebugInfo();
    },
    watch: {
        chosenMode: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        AItype: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        abDepth: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        tssDepth: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        timeLimit: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        debug: function(newVal, oldVal){
            if(newVal == false){
                this.abDepth = -1;
                this.tssDepth = -1;
                this.timeLimit = -1;
                this.AItype = 0;
            } else {
                this.abDepth = 1;
                this.tssDepth = 20;
                this.timeLimit = 1;
                this.AItype = 0;
            }
        }
    },
    methods: {
        updateDebugInfo() {
            this.$emit("set-debug-info", {
                mode: this.chosenMode,
                AItype: this.AItype,
                abDepth: this.abDepth,
                tssDepth: this.tssDepth,
                timeLimit: parseInt(this.timeLimit * 1000) // 从 s 转为毫秒
            });
        }
    },
    props: {
        modeOptions: {
            type: Object,
            required: true
        },
        start: {
            type: Boolean,
            required: true
        }
    },
    data: function() {
        return {
            chosenMode: this.modeOptions.HUMAN_TO_AI.value,
            abDepth: -1,
            tssDepth: -1,
            timeLimit: -1,
            AItype: 0,
            debug: false
        };
    }
};
</script>