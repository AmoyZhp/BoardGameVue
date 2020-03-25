export default class GomokuAction {
    constructor(row, col, player, timestep) {
        this.player = player
        this.row = row
        this.col = col
        this.timestep = timestep
    }
}