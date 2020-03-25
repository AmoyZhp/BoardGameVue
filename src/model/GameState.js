export default class GameState {
    constructor(chessboard, historyActions, timestamp, terminal) {
        this.historyActions = historyActions
        this.chessboard = chessboard
        this.timestamp = timestamp
        this.terminal = terminal
    }
}