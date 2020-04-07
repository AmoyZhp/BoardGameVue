<template>
    <div class="row">
        <div class="col-lg-3">
            <UserGuideBar
                v-bind:start="start"
                v-bind:terminal="terminal"
                v-bind:playerOptions="playerOptions"
                v-on:start-game="startGameWrap"
                v-on:set-player="setPlayer"
                v-on:action-back="ACTION_BACK"
                v-on:reset-game="RESET"
            />
        </div>
        <div class="col-lg-6">
            <div class="row">
                <div class="col d-flex justify-content-center">
                    <h5>{{gameStatus}}</h5>
                </div>
            </div>
            <ChessBoard
                v-bind:chessboard="chessboard"
                v-bind:start="start"
                v-bind:BOARD_PIXEL_SIZE="BOARD_PIXEL_SIZE"
                v-bind:playerOptions="playerOptions"
                v-bind:historyActions="historyActions"
                v-bind:terminal="terminal"
                v-on:step="stepWrap"
                v-on:start-game="startGameWrap"
            />
        </div>
        <div class="col-lg-3">
            <DevelopBar
                v-if="DEBUG"
                v-bind:start="start"
                v-bind:terminal="terminal"
                v-bind:modeOptions="modeOptions"
                v-on:set-debug-info="setDebugInfo"
            />
        </div>
    </div>
</template>
<script>
import ChessBoard from "@/components/ChessBoard";
import DevelopBar from "@/components/DevelopBar";
import UserGuideBar from "@/components/UserGuideBar";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
    created: function() {
        this.INIT_STATE();
        this.gameStatus = "等待开始";
    },
    methods: {
        startGameWrap() {
            this.startGame({
                player: this.chosenPlayer,
                mode: this.debugInfo.mode,
                AItype: this.debugInfo.AItype,
                depth: this.debugInfo.depth,
                times: this.debugInfo.times
            });
            this.gameStatus = "当前玩家 : 黑方";
        },
        stepWrap(row, col) {
            if (this.isLegalPos(row, col)) {
                this.STEP({ row: row, col: col });
                // 如果不是人人对战模式的话
                // 向后端请求下一个动作
                if (
                    this.mode == this.modeOptions.HUMAN_TO_AI.value ||
                    this.mode == this.modeOptions.AI_TO_AI.value
                ) {
                    this.stepFromAI();
                }
            }
        },
        hasFiveInRow(row, col, player) {
            console.log("row and col and player is", row, col, player)
            console.log("chessboard is", this.chessboard)
            let EMPTY = this.playerOptions.EMPTY.value;

            if (row < 0 || row >= this.HEIGHT || col < 0 || col >= this.WIDTH) {
                return false;
            }
            let cnt = 0;
            // 纵向
            cnt = 0;
            for (
                let i = Math.max(0, row - 4);
                i < Math.min(row + 5, this.HEIGHT);
                i++
            ) {
                if (this.chessboard[i][col] == player) {
                    cnt++;
                    if (cnt == 5) {
                        return true;
                    }
                } else if (this.chessboard[i][col] != EMPTY) {
                    cnt = 0;
                }
            }
            // 横向
            cnt = 0;
            for (
                let i = Math.max(0, col - 4);
                i < Math.min(col + 5, this.WIDTH);
                i++
            ) {
                if (this.chessboard[row][i] == player) {
                    cnt++;
                    if (cnt == 5) {
                        return true;
                    }
                } else if (this.chessboard[row][i] != EMPTY) {
                    cnt = 0;
                }
            }
            // 135 度
            cnt = 0;
            for (let i = -4; i <= 4; i++) {
                if (
                    row + i < 0 ||
                    row + i >= this.WIDTH ||
                    col + i < 0 ||
                    col + i >= this.HEIGHT
                ) {
                    continue;
                }
                if (this.chessboard[row + i][col + i] == player) {
                    cnt++;
                    if (cnt == 5) {
                        return true;
                    }
                } else if (this.chessboard[row + i][col + i] != EMPTY) {
                    cnt = 0;
                }
            }
            // 45 度
            cnt = 0;
            for (let i = -4; i <= 4; i++) {
                let x = row - i;
                let y = col + i;
                if (y < 0 || y >= this.WIDTH || x < 0 || x >= this.HEIGHT) {
                    continue;
                }
                if (this.chessboard[x][y] == player) {
                    cnt++;
                    if (cnt == 5) {
                        return true;
                    }
                } else if (this.chessboard[x][y] != EMPTY) {
                    cnt = 0;
                }
            }
            return false;
        },
        isLegalPos(row, col) {
            let EMPTY = this.playerOptions.EMPTY.value;
            if (row < 0 || row >= this.HEIGHT || col < 0 || col >= this.WIDTH) {
                return false;
            }
            if (this.chessboard[row][col] != EMPTY) {
                return false;
            }
            return true;
        },
        setPlayer(chosenPlayer) {
            this.chosenPlayer = chosenPlayer;
        },
        setDebugInfo(mode, AItype, depth, times) {
            this.debugInfo = {
                mode: mode,
                AItype: AItype,
                depth: depth,
                times: times
            };
            console.log(this.debugInfo);
        },
        ...mapMutations("gomoku/", [
            "INIT_STATE",
            "STEP",
            "RESET",
            "ACTION_BACK"
        ]),
        ...mapActions("gomoku/", [
            "startGame",
            "endGame",
            "step", // 接收 (row, col) 作为参数
            "stepFromAI"
        ])
    },
    computed: {
        start: {
            get() {
                return this.$store.state.gomoku.start;
            },
            set(value) {}
        },
        terminal: {
            get() {
                if (this.historyActions.length > 0) {
                    let action = this.historyActions[
                        this.historyActions.length - 1
                    ];
                    let terminal = this.hasFiveInRow(
                        action.row,
                        action.col,
                        action.player
                    );
                    if (terminal) {
                        this.endGame();
                    }
                }
                return this.$store.state.gomoku.terminal;
            },
            set(val) {}
        },
        gameStatus: {
            get() {
                if (this.terminal) {
                    return "游戏结束";
                }
                if (this.start == false) {
                    return "等待选择";
                }
                let msg = "当前玩家 : ";
                if (this.actingPlayer == this.playerOptions.BLACK.value) {
                    msg += "黑方";
                } else {
                    msg += "白方";
                }
                return msg;
            },
            set(val) {}
        },
        HEIGHT: function(){
            return this.chessboard.length
        },
        WIDTH: function(){
            return this.chessboard[0].length
        },
        ...mapState("gomoku/", [
            "chessboard",
            "actingPlayer",
            "historyActions",
            "BOARD_PIXEL_SIZE",
            "mode"
        ]),
        ...mapState("gomoku/", {
            playerOptions: state => {
                return {
                    BLACK: {
                        value: state.PLAYER_OPTIONS.BLACK,
                        name: "黑方"
                    },
                    WHITE: {
                        name: "白方",
                        value: state.PLAYER_OPTIONS.WHITE
                    },
                    EMPTY: {
                        name: "",
                        value: state.PLAYER_OPTIONS.EMPTY
                    }
                };
            },
            modeOptions: state => {
                return {
                    HUMAN_TO_AI: {
                        value: state.MODE_OPTIONS.HUMAN_TO_AI,
                        name: "人机对战"
                    },
                    AI_TO_AI: {
                        value: state.MODE_OPTIONS.AI_TO_AI,
                        name: "智能互搏"
                    },
                    HUMAN_TO_HUMAN: {
                        value: state.MODE_OPTIONS.HUMAN_TO_HUMAN,
                        name: "人人对战"
                    }
                };
            }
        })
    },
    data: function() {
        return {
            DEBUG: true,
            debugInfo: {
                mode: 0,
                AItype: 0,
                depth: 0,
                times: 0
            },
            chosenPlayer: 0
        };
    },
    components: {
        ChessBoard,
        DevelopBar,
        UserGuideBar
    }
};
</script>