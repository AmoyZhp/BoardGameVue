    
import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

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
        MODE_OPTIONS: {},
        PLAYER_OPTIONS: {},
        BOARD_PIXEL_SIZE: 0,
        WIDTH: 0,
        HEIGHT: 0,
    },
    mutations: mutations,
    actions: actions,
    getters: getters
}