import GomokuGameState from "@/model/GomokuGameState"
import gomokuApi from "@/api/gomokuApi"
import { STEP, RESET, START_GAME, END_GAME} from "./mutation-types"

export default {
    async stepFromAI({ state, commit }) {
        // 如果是人机对战模式，则请求下一个动作
        if (state.mode == state.MODE_OPTIONS.HUMAN_TO_AI ||
                state.mode == state.MODE_OPTIONS.AI_TO_AI) {
            let gameState = new GomokuGameState(state.chessboard, state.historyActions,
                state.timestep, state.terminal)
            let nextAction = await gomokuApi.requestNextAction(gameState, state.actingPlayer)
            console.log("next action is ",nextAction)
            commit({
                type: STEP,
                row: nextAction.row,
                col: nextAction.col
            })
        }
    },
    async step({ state, commit }, payload) {
        let { row, col } = payload
        commit({
            type: STEP,
            row: row,
            col: col,
        })
    },
    async startGame({ dispatch, state, commit }, payload) {
        commit(RESET)
        commit(START_GAME, payload)
        if (state.mode == state.MODE_OPTIONS.HUMAN_TO_AI) {
            let player = state.PLAYER_OPTIONS.EMPTY
            if (state.humanPlayer == state.PLAYER_OPTIONS.BLACK) {
                player = state.PLAYER_OPTIONS.WHITE
            } else {
                player = state.PLAYER_OPTIONS.BLACK
            }
            console.log("in start game of action")
            let response = await gomokuApi.startGame(player)
            console.log(response)
            if (player == state.PLAYER_OPTIONS.BLACK) {
                dispatch('stepFromAI')
            }
        }
    },
    async endGame({ state, commit }) {
        commit(END_GAME)
        let gameState = new GomokuGameState(state.chessboard, state.historyActions,
            state.timestep, state.terminal)
        let response = await gomokuApi.endGame(gameState)
        console.log(response)
    }
}