//@ts-check
import { TicTacToe, FINAL_DATA } from './game.js'

const PLAYER_NAME = ['X', 'O']
const ENUM_STATE = { unplayed: 0, playing: 1, finished: 2, replay: 3 }

export class Controller extends TicTacToe {
    container
    /**
     * @type {keyof typeof ENUM_STATE}
     */
    state
    stateContainer
    StateManager
    tilesContainer
    TilesManager
    /**
     * @type {(() => any)[]}
     */
    onGameProgressListeners

    /**
     * @param {HTMLElement} container
     */
    constructor(container) {
        super()
        this.container = container
        this.state = 'unplayed'
        this.stateContainer = document.createElement('div')
        this.stateContainer.id = 'state'
        this.tilesContainer = document.createElement('div')
        this.onGameProgressListeners = []
        this.container.appendChild(this.stateContainer)
        this.container.appendChild(this.tilesContainer)

        this.StateManager = new StateManager(this, this.stateContainer)
        this.TilesManager = new TilesManager(this, this.tilesContainer)
        // on startup only
        this.updateState('unplayed', true)
    }

    /**
     *
     * @param {keyof typeof ENUM_STATE} state
     * @param {boolean} force
     */
    updateState(state, force = false) {
        if (this.state === state && !force) return
        this.state = state
        this.StateManager.updateState(state)
        this.TilesManager.updateState(state)
    }

    updateGameProgress() {
        this.onGameProgressListeners.forEach(fn => fn())

        if (this.checkWinFromLastMoveAllFormula()) this.updateState('finished')
    }

    /**
     *
     * @param {() => any} fn
     */
    onGameProgress(fn) {
        this.onGameProgressListeners.push(fn)
    }

    /**
     *
     * @param {() => any} fn
     */
    removeOnGameProgress(fn) {
        this.onGameProgressListeners = this.onGameProgressListeners.filter(f => f !== fn)
    }
}

class StateManager {
    container
    controller
    /**
     * @type {keyof typeof ENUM_STATE}
     */
    currentState

    /**
     * @param {Controller} controller
     * @param {HTMLElement} container
     */
    constructor(controller, container) {
        this.controller = controller
        this.currentState = 'unplayed'
        this.container = container

        this.controller.onGameProgress(() => this.updateEffects())
        this.updateEffects()
    }

    /**
     *
     * @param {keyof typeof ENUM_STATE} state
     */
    updateState(state) {
        this.currentState = state

        this.updateEffects()
    }

    updateEffects() {
        for (const child of this.container.childNodes) {
            this.container.removeChild(child)
        }

        switch (this.currentState) {
            case 'unplayed':
                {
                    const button = document.createElement('button')
                    button.innerText = 'Play!'
                    button.classList.add('gamePlayButton')
                    button.addEventListener('click', () => {
                        this.controller.updateState('playing')
                        this.controller.play()
                    })

                    this.container.appendChild(button)
                }
                break
            case 'playing':
                {
                    const text = document.createElement('span')
                    text.innerText = `Your turn: ${PLAYER_NAME[this.controller.currentPlayerTurn]}`

                    this.container.appendChild(text)
                }
                break
            case 'finished':
                {
                    const text = document.createElement('span')
                    const winData = this.controller.checkWinFromLastMoveAllFormula()
                    if (winData == FINAL_DATA.WIN) {
                        text.innerText = `Winner: ${PLAYER_NAME[this.controller.win]}`
                    } else {
                        text.innerText = `Draw!`
                    }

                    this.container.appendChild(text)
                }
                break
        }
    }
}

class TilesManager {
    container
    controller
    /**
     * @type {keyof typeof ENUM_STATE}
     */
    currentState
    /**
     * @param {Controller} controller
     * @param {HTMLElement} container
     */
    constructor(controller, container) {
        this.controller = controller
        this.container = container
        this.currentState = 'unplayed'

        this.updateEffects()
        this.controller.onGameProgress(() => this.updateEffects())
    }

    /**
     * @param {keyof typeof ENUM_STATE} state
     */
    updateState(state) {
        this.currentState = state

        this.updateEffects()
    }

    updateEffects() {
        for (const child of this.container.childNodes) {
            this.container.removeChild(child)
        }

        const tilesContainer = document.createElement('div')
        tilesContainer.id = 'gameTiles'
        if (this.currentState != 'playing') {
            tilesContainer.classList.add('noclick')
        } else {
            tilesContainer.classList.remove('noclick')
        }

        this.container.append(tilesContainer)

        const tiles = this.genTiles()
        tilesContainer.append(...tiles)
    }

    genTiles() {
        /**
         * @type {HTMLElement[]}
         */
        const tiles = []
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const tile = document.createElement('div')
                tile.classList.add('tile')
                tile.addEventListener('click', () => {
                    this.controller.takeTurn(x, y)
                    this.controller.updateGameProgress()
                })

                const tileData = this.controller.matchData.find(data => data.x == x && data.y == y)
                if (tileData) tile.innerText = PLAYER_NAME[tileData.playerID]

                tiles.push(tile)
            }
        }

        return tiles
    }
}
