//@ts-check

/**
 * @typedef {number} FinalData
 */

/**
 * @enum {FinalData}
 */
export const FINAL_DATA = {
    UNFINISHED: 0,
    WIN: 1,
    DRAW: 2,
}

export class TicTacToe {
    started
    finished
    win
    /**
     * @typedef {Object} MatchData
     * @property {number} playerID
     * @property {number} x
     * @property {number} y
     */
    /**
     * @type {MatchData[]}
     */
    matchData
    currentPlayerTurn

    /**
     * @type {[number, number][]}
     *
     * formula specifies how to calculate the direction, be it horizontal, vertical, diagonal 1, diagonal 2
     * does not need to specify the inverse direction (like horizontal from the left/right)
     */
    formulas

    constructor() {
        this.started = false
        this.finished = false
        this.win = -1
        this.matchData = []
        this.currentPlayerTurn = 0
        this.formulas = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1],
        ]
    }

    // might be reused for replaying the game
    init() {
        this.started = false
        this.finished = false
        this.win = -1
        this.matchData = []
        this.currentPlayerTurn = 0
        this.formulas = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1],
        ]
    }

    /**
     * Starts the game
     * @returns {void}
     */
    play() {
        if (this.started) return
        this.started = true
        this.currentPlayerTurn = 0
    }

    /**
     * Do a player's turn. The current player corresponds to currentPlayerTurn
     * @param {number} x - The x coordinate of the plane (0, 2)
     * @param {number} y - The y coordinate of the plane (0, 2)
     *
     * @returns {boolean} valid - Whether the move is valid
     */

    takeTurn(x, y) {
        if (!this.started) return false
        const exists = this.matchData.find(data => data.x == x && data.y == y)
        if (exists || this.win != -1) return false

        this.matchData.push({ playerID: this.currentPlayerTurn, x, y })
        this.currentPlayerTurn = this.currentPlayerTurn ? 0 : 1

        const win = this.gameplayStatus
        if (win == FINAL_DATA.WIN) {
            this.win = this.matchData[this.matchData.length - 1].playerID
        }
        if (win != FINAL_DATA.UNFINISHED) {
            this.finished = true
        }

        return true
    }

    /**
     * @typedef {Object} WinProperty
     * @property {boolean} win
     * @property {[number, number]} formula
     * @property {[number, number][]} data - Arrays of x's and y's
     */

    /**
     *
     * @param {[number, number]} formula
     * @return {WinProperty}
     */

    checkWinFromLastMove(formula) {
        /**
         * @type {WinProperty}
         */
        const winData = {
            win: false,
            formula,
            data: [],
        }

        if (this.matchData.length == 0) return winData

        let count = 0
        const last = this.matchData[this.matchData.length - 1]
        const currentPlayerID = last.playerID
        winData.data.push([last.x, last.y])
        count++

        for (let i = 0; i < 2; i++) {
            const inverter = i ? -1 : 1
            let offset = 1

            while (count < 3) {
                const playerTurn = this.matchData.find(
                    data =>
                        data.playerID == currentPlayerID &&
                        data.x == last.x + formula[0] * (offset * inverter) &&
                        data.y == last.y + formula[1] * (offset * inverter)
                )

                if (!playerTurn) break
                winData.data.push([playerTurn.x, playerTurn.y])
                offset++
                count++
            }
        }

        winData.win = count == 3

        return winData
    }

    /**
     * @returns {WinProperty}
     */

    checkWinFromLastMoveAllFormula() {
        /**
         * @type {WinProperty}
         */
        const winData = {
            win: false,
            formula: [0, 0],
            data: [],
        }
        for (const formula of this.formulas) {
            const data = this.checkWinFromLastMove(formula)
            if (data.win) {
                return data
            }
        }

        return winData
    }

    /**
     * @returns {FinalData}
     */
    get gameplayStatus() {
        const data = this.checkWinFromLastMoveAllFormula()
        let win = FINAL_DATA.UNFINISHED

        if (data.win) {
            win = FINAL_DATA.WIN
        } else if (this.matchData.length == 9) {
            win = FINAL_DATA.DRAW
        }

        return win
    }
}
