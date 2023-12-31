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
        const exists = this.matchData.find(data => data.x == x && data.y == y)
        if (exists || this.win != -1) return false

        this.matchData.push({ playerID: this.currentPlayerTurn, x, y })
        this.currentPlayerTurn = this.currentPlayerTurn ? 0 : 1

        const win = this.checkWinFromLastMoveAllFormula()
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
            data: [],
        }

        if (this.matchData.length == 0) return winData

        let counted = 1
        const last = this.matchData[this.matchData.length - 1]
        const currentPlayerID = last.playerID

        for (let i = 0; i < 2; i++) {
            const inverter = i ? -1 : 1
            let checkIndex = 1

            while (counted < 3) {
                const exists = this.matchData.find(
                    data =>
                        data.playerID == currentPlayerID &&
                        data.x == last.x + formula[0] * (checkIndex * inverter) &&
                        data.y == last.y + formula[1] * (checkIndex * inverter)
                )

                if (!exists) break
                winData.data.push([exists.x, exists.y])
                counted++
                checkIndex++
            }
        }

        winData.win = counted == 3

        return winData
    }

    /**
     * @returns {FinalData}
     */

    checkWinFromLastMoveAllFormula() {
        let win = FINAL_DATA.UNFINISHED
        for (const formula of this.formulas) {
            if (this.checkWinFromLastMove(formula).win) {
                win = FINAL_DATA.WIN
            }
        }

        if (win == FINAL_DATA.UNFINISHED && this.matchData.length == 9) win = FINAL_DATA.DRAW

        return win
    }
}
