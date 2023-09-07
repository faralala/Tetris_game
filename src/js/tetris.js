import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, TETRISFIGURE_NAMES, TETRISFIGURIES, getRandomElement, rotateMatrix } from './utilities.js'

export class Tetris {
	constructor() {
		this.playfield
		this.tetrisFigure
		this.isGameOver = false
		this.score = 0
		this.init()
	}

	init() {
		this.createPlayfield()
		this.createTetrisFigure()
		this.updateScore()
	}

	createPlayfield() {
		this.playfield = new Array(PLAYFIELD_ROWS).fill().map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
	}

	createTetrisFigure() {
		const name = getRandomElement(TETRISFIGURE_NAMES)
		const matrix = TETRISFIGURIES[name]

		const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2)
		const row = -2

		this.tetrisFigure = {
			name,
			matrix,
			row,
			column,
			ghostColumn: column,
			ghostRow: row,
		}
		this.calculateGhostPosition()
	}

	moveTetrisFigureDown() {
		this.tetrisFigure.row += 1
		if (!this.isValid()) {
			this.tetrisFigure.row -= 1
			this.placeTetrisFigure()
		}
	}
	moveTetrisFigureLeft() {
		this.tetrisFigure.column -= 1
		if (!this.isValid()) {
			this.tetrisFigure.column += 1
		} else {
			this.calculateGhostPosition()
		}
	}
	moveTetrisFigureRight() {
		this.tetrisFigure.column += 1
		if (!this.isValid()) {
			this.tetrisFigure.column -= 1
		} else {
			this.calculateGhostPosition()
		}
	}

	rotateTetrisFigure() {
		const oldMatrix = this.tetrisFigure.matrix
		const rotatedMatrix = rotateMatrix(this.tetrisFigure.matrix)
		this.tetrisFigure.matrix = rotatedMatrix
		if (!this.isValid()) {
			this.tetrisFigure.matrix = oldMatrix
		} else {
			this.calculateGhostPosition()
		}
	}

	dropTetrisFigureDown() {
		this.tetrisFigure.row = this.tetrisFigure.ghostRow
		this.placeTetrisFigure()
	}

	isValid() {
		const matrixSize = this.tetrisFigure.matrix.length
		for (let row = 0; row < matrixSize; row++) {
			for (let column = 0; column < matrixSize; column++) {
				if (!this.tetrisFigure.matrix[row][column]) continue
				if (this.isOutsideOfGameBoard(row, column)) return false
				if (this.isCollides(row, column)) return false
			}
		}
		return true
	}

	isOutsideOfGameBoard(row, column) {
		return (
			this.tetrisFigure.column + column < 0 ||
			this.tetrisFigure.column + column >= PLAYFIELD_COLUMNS ||
			this.tetrisFigure.row + row >= this.playfield.length
		)
	}

	isCollides(row, column) {
		return this.playfield[this.tetrisFigure.row + row]?.[this.tetrisFigure.column + column]
	}

	placeTetrisFigure() {
		const matrixSize = this.tetrisFigure.matrix.length
		for (let row = 0; row < matrixSize; row++) {
			for (let column = 0; column < matrixSize; column++) {
				if (!this.tetrisFigure.matrix[row][column]) continue
				if (this.isOutsideOfTopBoard(row)) {
					this.isGameOver = true
					return
				}
				this.playfield[this.tetrisFigure.row + row][this.tetrisFigure.column + column] = this.tetrisFigure.name
			}
		}
		this.processFilledRows()
		this.createTetrisFigure()
	}

	isOutsideOfTopBoard(row) {
		return this.tetrisFigure.row + row < 0
	}

	processFilledRows() {
		const filledLines = this.findFilledRows()
		this.removeFilledRows(filledLines)
		this.score += filledLines.length * 10
		this.updateScore()
	}

	findFilledRows() {
		const filledRows = []
		for (let row = 0; row < PLAYFIELD_ROWS; row++) {
			if (this.playfield[row].every(cage => Boolean(cage))) {
				filledRows.push(row)
			}
		}
		return filledRows
	}

	removeFilledRows(filledRows) {
		filledRows.forEach(row => {
			this.dropRowsAbove(row)
		})
	}

	dropRowsAbove(rowToDelete) {
		for (let row = rowToDelete; row > 0; row--) {
			this.playfield[row] = this.playfield[row - 1]
		}
		this.playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0)
	}

	calculateGhostPosition() {
		const tetrisFigureRow = this.tetrisFigure.row
		this.tetrisFigure.row++
		while (this.isValid()) {
			this.tetrisFigure.row++
		}
		this.tetrisFigure.ghostRow = this.tetrisFigure.row - 1
		this.tetrisFigure.ghostColumn = this.tetrisFigure.column
		this.tetrisFigure.row = tetrisFigureRow
	}

	updateScore() {
		const scoreElement = document.getElementsByTagName('input')[0]
		scoreElement.value = `Ваши очки: ${this.score}`
	}
}
