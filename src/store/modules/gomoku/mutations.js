import {
    INIT_STATE, RESET, STEP,
    ACTION_BACK, START_GAME,END_GAME
} from "./mutation-types"

import {
    WIDTH, HEIGHT, PLAYER_OPTIONS,
    MODE_OPTIONS, BOARD_PIXEL_SIZE
} from "@/config/gomoku"

import GomokuAction from "@/model/gomoku/GomokuAction"

export default {
    [INIT_STATE](state) {
        state.WIDTH = WIDTH
        state.HEIGHT = HEIGHT
        state.PLAYER_OPTIONS = PLAYER_OPTIONS
        state.MODE_OPTIONS = MODE_OPTIONS
        state.BOARD_PIXEL_SIZE = BOARD_PIXEL_SIZE
        state.chessboard = new Array(state.HEIGHT)
        for (let i = 0; i < state.chessboard.length; i++) {
            state.chessboard[i] = new Array(state.WIDTH)
        }
        state.start = false
        state.terminal = false
        state.timestep = 0
        state.historyActions = []
        for (let i = 0; i < state.HEIGHT; i++) {
            for (let j = 0; j < state.WIDTH; j++) {
                state.chessboard[i][j] = state.PLAYER_OPTIONS.EMPTY
            }
        }
        state.actingPlayer = state.PLAYER_OPTIONS.BLACK
        state.mode = state.MODE_OPTIONS.HUMAN_TO_AI
    },
    [RESET](state) {
        state.start = false
        state.terminal = false
        state.timestep = 0
        state.historyActions = []
        for (let i = 0; i < state.HEIGHT; i++) {
            for (let j = 0; j < state.WIDTH; j++) {
                state.chessboard[i][j] = state.PLAYER_OPTIONS.EMPTY
            }
        }
        state.actingPlayer = state.PLAYER_OPTIONS.BLACK
        state.mode = state.MODE_OPTIONS.HUMAN_TO_AI
    },
    [STEP](state, { row, col }) {
        if (state.chessboard[row][col] == state.PLAYER_OPTIONS.EMPTY) {
            state.timestep += 1
            let action = new GomokuAction(row, col, state.actingPlayer)
            state.historyActions.push(action)
            state.chessboard[action.row][action.col] = action.player
            if (state.actingPlayer == state.PLAYER_OPTIONS.BLACK) {
                state.actingPlayer = state.PLAYER_OPTIONS.WHITE
            } else {
                state.actingPlayer = state.PLAYER_OPTIONS.BLACK
            }
        }
    },
    [ACTION_BACK](state, { step }) {
        // 回退 step 步
        if (state.historyActions.length - step >= 0) {
            while (step-- > 0) {
                let removeAction = state.historyActions.pop()
                state.chessboard[removeAction.row][removeAction.col] = state.PLAYER_OPTIONS.EMPTY
                state.timestep -= 1
                state.actingPlayer = removeAction.player
            }
        }
        state.terminal = false
    },
    [START_GAME](state, { player, debugMode, debugInfo }) {
        state.start = true
        state.terminal = false
        state.actingPlayer = state.PLAYER_OPTIONS.BLACK
        if(debugMode){
            state.mode = debugInfo.mode
        } else {
            state.mode = state.MODE_OPTIONS.HUMAN_TO_AI
        }
        if (state.mode == state.MODE_OPTIONS.HUMAN_TO_AI) {
            state.humanPlayer = player
        }
        // if (state.mode == state.MODE_OPTIONS.HUMAN_TO_HUMAN) {

        // }
        // if (state.mode == state.MODE_OPTIONS.AI_TO_AI) {

        // }
    },
    [END_GAME](state){
        state.terminal = true
    }
}