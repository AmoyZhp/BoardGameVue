import GomokuAction from "@/model/GomokuAction"
import axios from 'axios'

export default{
    async requestNextAction(state, requiredPlayer){
        let chessboard = state.chessboard
        let historyActions = state.historyActions
        let lastAction = new GomokuAction(-1, -1, -1)
        if(historyActions.length > 0){
            lastAction = historyActions[historyActions.length-1]
        }
        let timestep = state.timestep
        let terminal = state.terminal
        let action = new GomokuAction(-1, -1, -1)
        try{
            let address = 'http://127.0.0.1:8181/'+ 'gomoku/getnextmove'
            let response = await axios.post(address, {
                requiredPlayer: requiredPlayer,
                lastActionDTO: lastAction,
                stateDTO: {
                    chessboard: chessboard,
                    terminal: terminal,
                },
                historyActionsDTO: historyActions,
                timestep: timestep,
            })
            console.log(response)
            let actionDTO = response.data.lastActionDTO
            let action = new GomokuAction(actionDTO.row, actionDTO.col, 
                    actionDTO.player)
            return action
        }catch(error){
            console.log(error)
            alert("服务端无连接")
            return action
        }
    },
    async startGame(aiPlayer){
        try{
            let address = 'http://127.0.0.1:8181/' + 'gomoku/startgame'
            let response = await axios.get(address, {
                params :{
                    aiPlayer: aiPlayer,
                },
                
            })
            return response
        } catch(error){
            console.log(error)
            return null
        }
    },
    async endGame(){

    },
}