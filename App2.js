document.addEventListener('DOMContentLoaded', () => {

    // types of variable const, let, var
    const grid = document.querySelector('.grid')

    function createDiv() {

        for (i = 0; i < 200; i++) {
            var div = document.createElement('DIV')
            grid.appendChild(div)
        }

        for (i = 0; i < 11; i++) {
            var invdiv = document.createElement('DIV')
            invdiv.setAttribute('class', 'taken')
            grid.appendChild(invdiv)
        }
    }
    createDiv()
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let nextRandom = 0
    let timerID
    let score = 0

    // The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2] ,
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let random = Math.floor(Math.random()*theTetrominoes.length)
    let currentPosition = 4
    let currentRotation = 0

    let current = theTetrominoes[random][0]

    // draw the first rotation in the first tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    // make the tetromino move down every 0.5 seconds
    // timerID = setInterval(moveDown, 500)

    // assign functions to KeyCodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }


document.addEventListener('keyup', control)
    // move down function
    function moveDown() {
        undraw()
        currentPosition += width // same as currentPosition = currentPosition + width
        draw()
        freeze()
    }

    // freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length) // this nextRandom will contribute to display Next Random
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    // move the tetromino left, unless is at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)

        if(!isAtRightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -=1
        }

        draw()
    }

    // rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }

        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    // the Tetromino without rotations
    const upNextTetromino = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        // remove any tetromino from this grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNextTetromino[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

    // add functionality to the button
    startBtn.addEventListener('click', () => {
        if(timerID) {
            clearInterval(timerID)
            timerID = null
        } else {
            draw()
            timerID = setInterval(moveDown, 500)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    // add score, removed whole row, move the next row to the bottom
    function addScore() {
        for (let i=0; i < 199; i +=width) {
            const row  = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })

                squaresRemoved = squares.splice(i, width)       //remove the squares through index
                squares = squaresRemoved.concat(squares)        //add the removed squares back to the front of the squares
                squares.forEach(cell => grid.appendChild(cell)) // reset the grid
            }
        }
    }


    //gamer over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerID)
        }
    }
})