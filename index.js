import { TicTacToe } from './game.js'
import { Controller } from './controller.js'

const gameContainer = document.getElementById('gameContainer')
const game = new TicTacToe()
const controller = new Controller(game, gameContainer)
