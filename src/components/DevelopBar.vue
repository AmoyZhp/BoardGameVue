<template>
    <div class="row">
        <div class="col">
            <ul class="list-group">
                <li class="list-group-item">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <label class="input-group-text">模式</label>
                        </div>
                        <select class="custom-select" v-model="chosenMode" :disabled="start">
                            <option
                                v-for="item in modeOptions"
                                v-bind:value="item.value"
                                :key="item.value"
                            >{{item.name}}</option>
                        </select>
                    </div>
                </li>
                <li class="list-group-item"></li>
                <li class="list-group-item">
                    
                </li>
                <li class="list-group-item"></li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {

    mounted: function(){
        this.updateDebugInfo()
    },
    watch: {
        chosenMode: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        AItype: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        depth: function(newVal, oldVal) {
            this.updateDebugInfo();
        },
        times: function(newVal, oldVal) {
            this.updateDebugInfo();
        }
    },
    methods: {
        updateDebugInfo() {
            this.$emit(
                "set-debug-info",
                this.chosenMode,
                this.AItype,
                this.depth,
                this.times
            );
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
            depth: 0,
            times: 100,
            AItype: 0
        };
    }
};
</script>