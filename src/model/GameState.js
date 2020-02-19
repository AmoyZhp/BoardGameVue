export default class GameState {
    constructor(chessboard, timestamp, terminal) {
        this.chessboard = chessboard
        this.timestamp = timestamp
        this.terminal = terminal
    }
}