const BOARD_PIXEL_SIZE = 570
const WIDTH = 15
const HEIGHT = 15
const MODE_OPTIONS = {
    HUMAN_TO_HUMAN: 0,
    HUMAN_TO_AI: 1,
    AI_TO_AI: 2,
}
const PLAYER_OPTIONS = {
    EMPTY: 0,
    BLACK: 1,
    WHITE: 2,
}

import gomokuApi from "@/api/gomokuApi.js"
import GomokuAction from "@/model/GomokuAction"
import GomokuGameState from "@/model/GomokuGameState"

export default {
    namespaced: true,
    state: {
        start: false,
        terminal: false,
        timestep: 0,
        chessboard: [[]],
        historyActions: [],
        actingPlayer: null,
        humanPlayer: null,
        mode: null,
        MODE_OPTIONS: null,
        PLAYER_OPTIONS: null,
        BOARD_PIXEL_SIZE: 0,
        WIDTH: 0,
        HEIGHT: 0,

    },
    mutations: {
        initState(state){
            state.WIDTH = WIDTH
            state.HEIGHT = HEIGHT
            state.PLAYER_OPTIONS = PLAYER_OPTIONS
            state.MODE_OPTIONS = MODE_OPTIONS
            state.BOARD_PIXEL_SIZE = BOARD_PIXEL_SIZE
            state.chessboard = new Array(state.HEIGHT)
            for(let i = 0; i < state.chessboard.length; i++){
                state.chessboard[i] = new Array(state.WIDTH)
            }

        },
        reset(state){
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

        step(state, payload){
            state.timestep += 1
            let action = new GomokuAction(payload.row, payload.col,
                state.actingPlayer)
            state.historyActions.push(action)
            state.chessboard[action.row][action.col] = action.player
            if(state.actingPlayer == PLAYER_OPTIONS.BLACK){
                state.actingPlayer = PLAYER_OPTIONS.WHITE
            } else {
                state.actingPlayer = PLAYER_OPTIONS.BLACK
            }
        },
        actionBack(state){
            if(state.historyActions.length > 0){
                let action = state.historyActions.pop()
                state.chessboard[action.row][action.col] = state.PLAYER_OPTIONS.EMPTY
                state.timestep -= 1
                state.actingPlayer = action.player
            }
        },
        setTerminal(state, terminal){
            state.terminal = terminal
        },
        startGame(state, payload){
            state.start = true
            state.terminal = false
            state.mode = payload.mode
            state.actingPlayer = state.PLAYER_OPTIONS.BLACK
            if(state.mode == state.MODE_OPTIONS.HUMAN_TO_AI){
                state.humanPlayer = payload.player
            }
        },
    },
    actions: {
        async requestNextAction({state, commit}){
            let gameState = new GomokuGameState(state.chessboard, state.historyActions, 
                state.timestep, state.terminal)
            let nextAction = await gomokuApi.requestNextAction(gameState, state.actingPlayer)
            console.log(nextAction)
            commit({
                type:'step',
                row: nextAction.row,
                col: nextAction.col
            })
        },
        async startGame({ dispatch ,state, commit}, payload){
            commit('reset')
            commit('startGame', payload)
            if(state.mode == state.MODE_OPTIONS.HUMAN_TO_AI){
                let player = state.PLAYER_OPTIONS.EMPTY
                if(state.humanPlayer == state.PLAYER_OPTIONS.BLACK){
                    player = state.PLAYER_OPTIONS.WHITE
                } else {
                    player = state.PLAYER_OPTIONS.BLACK
                }
                let response = await gomokuApi.startGame(player)
                console.log(response)
                if(player == state.PLAYER_OPTIONS.BLACK){
                    dispatch('requestNextAction')
                }
            }
        },
        async endGame({state, commit}){
            let gameState = new GomokuGameState(state.chessboard, state.historyActions, 
                state.timestep, state.terminal)
            let response = await gomokuApi.endGame(gameState)
            console.log(response)
        }
    },
}