document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid') // Assign to grid in html
    let squares = Array.from(document.querySelectorAll('.grid div'))
    // turn all squares from grid into an array
    const width = 10
    var score = 0 // starting score
    var gameOn=0 // Toggle for game being on or paused
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let timerId

    const tetrisColors = [
        'red', 'green', 'blue', 'orange', 'white'
    ]
    // The Tetris Shapes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]


    // Initalise the tetrominio rotation and position
    let currentPosition = 4
    let currentRotation = 0
    // Randomly select a Tetris Shape
    let random = Math.floor(Math.random() * theTetrominoes.length) // initialise
    let nextRandom = 0

    function randomNum() {
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    }
    randomNum()
    let current = theTetrominoes[random][currentRotation]

    // draw the Tetromino
    function draw() {
        // add class to all div squares based on the current position and shape
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = tetrisColors[random]

        })
    }

    // remove the tetromino
    function unDraw() {
        // remove class
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Move shape down the page every second
    //timerId = setInterval(moveDown,1000)

    // assign function to key movements
    function control(e) {
      if (gameOverKey == 0 && gameOn==1) {
          if (e.keyCode === 37) {
              moveLeft()
          } else if (e.keyCode === 38) {
              rotate()
          } else if (e.keyCode === 39) {
              moveRight()
          } else if (e.keyCode === 40) {
              moveDown()
          }
      }
    }
    // when key is pressed invoke control function to look for key to invoke other function
    document.addEventListener('keyup', control)

    // move down function
    function moveDown() {
        unDraw()
        currentPosition += width
        draw()
        freeze()
    }
    // freeze the shape at bottom
    function freeze() {
        // if any of the shapes are in a 'taken' div then add the class to the whole shape
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start a new shape falling
            random = nextRandom
            randomNum()
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // Move the shape left, unless it is far left or blocked by a shape
    function moveLeft() {
        unDraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        // if not at left edge then move left
        if (!isAtLeftEdge) currentPosition -= 1
        // if moving puts it into taken slot then move back or +1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    // Move the shape right, unless it is far right or blocked by a shape
    function moveRight() {
        unDraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        // if not at left edge then move left
        if (!isAtRightEdge) currentPosition += 1
        // if moving puts it into taken slot then move back or +1
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }
    // rotating the shapes
    function rotate() {
        unDraw()
        currentRotation++
        // if the rotation reaches last shape then reset
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // show next tetromino in display

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    // Tetris shapes without rotations for display
    const upNext = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    // display next shapes in preview
    function displayShape() {
        // remove preview
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })

        upNext[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = tetrisColors[nextRandom]
        })
    }
    // Display Shape when the page is loaded
    displayShape()

    // add functionality to button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
            gameOn=0
            startBtn.innerHTML="Start"
        } else {
            gameOn=1
            draw()
            timerId = setInterval(moveDown, 1000)
            startBtn.innerHTML="Stop"
        }
    })

    // add Score
    function addScore() {
        // Run for each row of tetris grid and move to next row (+10)
        for (let i = 0; i < 199; i += width) {
            // constant for every grid in row
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            // if every row has taken then add 10 and display
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                // then remove the class of taken and tetromino from the divs
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                console.log("I'm working")
                // constant of spliced squares row
                const squaresRemoved = squares.splice(i, width)
                // the squares are the removed line + the squares
                squares = squaresRemoved.concat(squares)
                // append the grid with this HTML
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    let gameOverKey=0
    // define the game over
    function gameOver() {
        // if any of the top row are 'taken' then end
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            // display final score and stop timerId from triggering
            scoreDisplay.innerHTML = score + " - GAME OVER!"
            clearInterval(timerId)
            gameOverKey=1
            gameOn=0
        }
    }

})
