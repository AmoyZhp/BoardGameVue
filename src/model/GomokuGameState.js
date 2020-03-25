export default class GomokuGameState {
    constructor(chessboard, timestep, terminal) {
        this.chessboard = chessboard
        this.timestep = timestep
        this.terminal = terminal
    }
}