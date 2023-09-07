import { Tetris } from './tetris.js'
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionToIndex } from './utilities.js'

let requestId
let timeoutId

const tetris = new Tetris()
const cages = document.querySelectorAll('.grid>div')

initKeydown()
moveDown()

function initKeydown() {
	document.addEventListener('keydown', onKeydown)
}

function onKeydown(event) {
	switch (event.key) {
		case 'ArrowUp':
			rotate()
			break
		case 'ArrowDown':
			moveDown()
			break
		case 'ArrowLeft':
			moveLeft()
			break
		case 'ArrowRight':
			moveRight()
			break
		case ' ':
			dropDown()
			break
		default:
			return
	}
}

function moveDown() {
	tetris.moveTetrisFigureDown()
	draw()
	stopLoop()
	startLoop()

	if (tetris.isGameOver) {
		gameOver()
	}
}

function moveLeft() {
	tetris.moveTetrisFigureLeft()
	draw()
}

function moveRight() {
	tetris.moveTetrisFigureRight()
	draw()
}

function rotate() {
	tetris.rotateTetrisFigure()
	draw()
}

function dropDown() {
	tetris.dropTetrisFigureDown()
	draw()
	stopLoop()
	startLoop()

	if (tetris.isGameOver) {
		gameOver()
	}
}

function startLoop() {
	timeoutId = setTimeout(() => (requestId = requestAnimationFrame(moveDown)), 700)
}
function stopLoop() {
	cancelAnimationFrame(requestId)
	clearTimeout(timeoutId)
}

function draw() {
	cages.forEach(cage => cage.removeAttribute('class'))
	drawPlayfield()
	drawTetrisFigure()
	drawGhostTetrisFigure()
}

function drawPlayfield() {
	for (let row = 0; row < PLAYFIELD_ROWS; row++) {
		for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
			if (!tetris.playfield[row][column]) continue
			const name = tetris.playfield[row][column]
			const cageIndex = convertPositionToIndex(row, column)
			cages[cageIndex].classList.add(name)
		}
	}
}

function drawTetrisFigure() {
	const name = tetris.tetrisFigure.name
	const tetrisFigureMatrixSize = tetris.tetrisFigure.matrix.length
	for (let row = 0; row < tetrisFigureMatrixSize; row++) {
		for (let column = 0; column < tetrisFigureMatrixSize; column++) {
			if (!tetris.tetrisFigure.matrix[row][column]) continue
			if (tetris.tetrisFigure.row + row < 0) continue
			const cageIndex = convertPositionToIndex(tetris.tetrisFigure.row + row, tetris.tetrisFigure.column + column)
			cages[cageIndex].classList.add(name)
		}
	}
}

function drawGhostTetrisFigure() {
	const tetrisFigureMatrixSize = tetris.tetrisFigure.matrix.length
	for (let row = 0; row < tetrisFigureMatrixSize; row++) {
		for (let column = 0; column < tetrisFigureMatrixSize; column++) {
			if (!tetris.tetrisFigure.matrix[row][column]) continue
			if (tetris.tetrisFigure.ghostRow + row < 0) continue
			const cageIndex = convertPositionToIndex(tetris.tetrisFigure.ghostRow + row, tetris.tetrisFigure.ghostColumn + column)
			cages[cageIndex].classList.add('ghost')
		}
	}
}

function gameOver() {
	stopLoop()
	document.removeEventListener('keydown', onKeydown)
	gameOverAnimation()
}

function gameOverAnimation() {
	const filledcages = [...cages].filter(cage => cage.classList.length > 0)
	filledcages.forEach((cage, i) => {
		setTimeout(() => cage.classList.add('hide'), i * 10)
		setTimeout(() => cage.removeAttribute('class'), i * 10 + 500)
	})
}
