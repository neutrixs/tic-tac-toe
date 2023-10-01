//@ts-check
import { TicTacToe, FINAL_DATA } from './game.js'

const PLAYER_NAME = ['X', 'O']

export class Controller {
    Game
    stateElement
    gridElement
    /**
     * @typedef {HTMLDivElement[][]} tiles
     * @type {tiles}
     */
    tiles

    /**
     * @param {TicTacToe} Game
     * @param {HTMLDivElement} container
     */
    constructor(Game, container) {
        this.Game = Game
        this.stateElement = document.createElement('div')
        this.stateElement.id = 'state'
        this.gridElement = document.createElement('div')
        this.gridElement.id = 'gameGrid'
        this.gridElement.style.cursor = 'not-allowed'
        this.tiles = this.genTiles()
        this.loadTiles()

        container.appendChild(this.stateElement)
        container.appendChild(this.gridElement)

        this.stateElement.appendChild(this.genPlayButton())
    }

    /**
     * @returns {HTMLDivElement}
     */
    genPlayButton() {
        const element = document.createElement('div')
        element.classList.add('gamePlayButton')

        const playText = document.createElement('span')
        playText.innerText = 'Play!'
        element.appendChild(playText)

        element.addEventListener('click', () => {
            this.play()
        })

        return element
    }

    /**
     * @param {string} text
     * @returns {HTMLSpanElement}
     */
    genStateText(text) {
        const element = document.createElement('span')
        element.innerText = text

        return element
    }

    /**
     * Internal function to generate the 9 tiles
     * @returns {tiles}
     */

    genTiles() {
        /**
         * @type {tiles}
         */
        const list = []

        for (let y = 0; y < 3; y++) {
            list.push([])
            for (let x = 0; x < 3; x++) {
                const element = document.createElement('div')
                element.classList.add('tile')
                element.addEventListener('click', () => {
                    this.turn(x, y)
                })

                list[y].push(element)
            }
        }

        return list
    }

    /**
     * @returns {void}
     */

    loadTiles() {
        while (this.gridElement.lastChild) this.gridElement.removeChild(this.gridElement.lastChild)

        for (const elements of this.tiles) {
            for (const element of elements) {
                this.gridElement.appendChild(element)
            }
        }
    }

    /**
     * @returns {void}
     */
    play() {
        this.Game.play()
        this.updateTurnText()
        this.gridElement.style.cursor = 'pointer'
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    turn(x, y) {
        if (!this.Game.started || this.Game.finished) {
            return
        }

        const currentTurn = this.Game.currentPlayerTurn
        const valid = this.Game.takeTurn(x, y)
        if (!valid) return

        this.tiles[y][x].innerText = PLAYER_NAME[currentTurn]
        this.updateTurnText()

        const winData = this.Game.checkWinFromLastMoveAllFormula()
        switch (winData) {
            case FINAL_DATA.WIN:
                {
                    const text = 'Winner: ' + PLAYER_NAME[this.Game.win]
                    this.updateTurnTextCustom(text)
                }
                break
            case FINAL_DATA.DRAW: {
                this.updateTurnTextCustom('Draw!')
            }
        }
    }

    /**
     * @returns {void}
     */
    updateTurnText() {
        this.stateElement.firstChild?.remove()
        this.stateElement.appendChild(this.genStateText('Your turn: ' + PLAYER_NAME[this.Game.currentPlayerTurn]))
    }

    /**
     * @returns {void}
     * @param {string} text
     */
    updateTurnTextCustom(text) {
        this.stateElement.firstChild?.remove()
        this.stateElement.appendChild(this.genStateText(text))
    }
}
