export default class GomokuGameState {
    constructor(chessboard, historyActions, timestep, terminal) {
        this.chessboard = chessboard
        this.historyActions = historyActions
        this.timestep = timestep
        this.terminal = terminal
    }
}