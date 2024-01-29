//@ts-check
import { Controller } from './controller.js'
const gameContainer = document.getElementById('gameContainer')
if (gameContainer) {
    new Controller(gameContainer)
}
