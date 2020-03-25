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

export default {
    namespaced: true,
    state: {
        start: false,
        terminal: false,
        timestep: 0,
        actionCnt: 0,
        chessboard: [[]],
        historyActions: [],
        actingPlayer: null,
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
            state.actionCnt = state.historyActions.length
            state.actingPlayer = state.PLAYER_OPTIONS.BLACK
            state.mode = state.MODE_OPTIONS.HUMAN_TO_AI
        },

        step(state, payload){

        },
        actionBack(state){
            
        },
        setStart(state, payload){
            state.start = payload.start
        },

        setTerminal(state, payload){

        },
        setMode(state, payload){
            state.mode = payload.mode
        }
        
        
       
    },
    actions: {
        requestNextAction({state, commit}){

        },
        initGame({state, commit}){

        },
        endGame({state, commit}){

        }
    },
}