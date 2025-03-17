// game elements
const gameGrid = document.getElementById("gameGrid")
const apple = document.getElementById("apple")

// UI game elements
const gameOverModal = document.getElementById("gameOverModal")
const finalScore = document.getElementById("finalScore")
const restartButton = document.getElementById("restartButton")

// game vars
const snakeBody = []

const appleCoordinates = { x: null, y: null }

let snakeDirection = "right"
let movementInterval

// game functions
function initializeGrid() {
    for (let y = 1; y <= 10; y++) {
        for (let x = 1; x <= 10; x++) {
            const sqm = document.createElement("div")

            sqm.classList.add("relative", "flex", "justify-center", "items-center", "text-4xl")
            sqm.style.aspectRatio = "1"
            sqm.dataset.x = x
            sqm.dataset.y = y

            // UI feature: Checkerboard pattern
            if ((x + y) % 2 === 0) {
                sqm.classList.add("bg-gray-50")
            } else {
                sqm.classList.add("bg-white")
            }

            gameGrid.appendChild(sqm)
        }
    }
}
initializeGrid()

// generate random numbers between 1 and 10, to spawn apple and snake randomly
function genRandomNumber() {
    return Math.floor(Math.random() * 10) + 1
}

function spawnSnake() {
    const xInitial = genRandomNumber()
    const yInitial = genRandomNumber()

    snakeBody.push({ x: xInitial, y: yInitial })

    renderSnake()
}

function spawnApple() {
    let appleX = genRandomNumber()
    let appleY = genRandomNumber()

    while (snakeBody.some((segment) => segment.x === appleX && segment.y === appleY)) {
        appleX = genRandomNumber()
        appleY = genRandomNumber()
    }

    appleCoordinates.x = appleX
    appleCoordinates.y = appleY

    document.querySelector(`[data-x="${appleX}"][data-y="${appleY}"]`).appendChild(apple)
}

function move() {
    const head = { ...snakeBody[0] }

    switch (snakeDirection) {
        case "up":
            head.y -= 1
            break
        case "down":
            head.y += 1
            break
        case "left":
            head.x -= 1
            break
        case "right":
            head.x += 1
            break
    }

    // check wall collision
    if (head.x < 1 || head.x > 10 || head.y < 1 || head.y > 10) {
        gameOver()
        return
    }

    // check snake body collision
    if (snakeBody.some((segment) => segment.x === head.x && segment.y === head.y)) {
        gameOver()
        return
    }

    // add new snake head position
    snakeBody.unshift(head)

    // if eat apple, don't remove last segment
    if (head.x === appleCoordinates.x && head.y === appleCoordinates.y) {
        spawnApple()
    } else {
        // remove last segment to keep the size
        snakeBody.pop()
    }

    renderSnake()
}

// update snake position
function renderSnake() {
    document.querySelectorAll(".snake-segment").forEach((segment) => segment.remove())

    snakeBody.forEach((segment, index) => {
        const cell = document.querySelector(`[data-x="${segment.x}"][data-y="${segment.y}"]`)
        const div = document.createElement("div")

        // UI feature: check head or body to assign the color
        if (index === 0) {
            // head
            div.classList.add("bg-secondary", "rounded-full", "absolute", "snake-segment", "transition-all", "duration-200")
            div.style.width = "80%"
            div.style.height = "80%"
        } else {
            // body
            div.classList.add("bg-primary", "rounded-full", "absolute", "snake-segment", "transition-all", "duration-200")
            div.style.width = "70%"
            div.style.height = "70%"
        }

        cell.appendChild(div)
    })

    renderStats()
}

function startGame() {
    snakeBody.length = 0
    clearInterval(movementInterval)

    // UI feature: Show apple element but make it visible
    apple.classList.remove("hidden")
    apple.style.position = "absolute"
    apple.style.fontSize = "2rem"
    apple.style.zIndex = "10"

    spawnSnake()
    spawnApple()
    renderStats()
}

startGame()

function renderStats() {
    document.getElementById("snakeX").textContent = snakeBody[0].x
    document.getElementById("snakeY").textContent = snakeBody[0].y
    document.getElementById("appleX").textContent = appleCoordinates.x
    document.getElementById("appleY").textContent = appleCoordinates.y
    document.getElementById("score").textContent = snakeBody.length - 1
    document.getElementById("finalScore").textContent = snakeBody.length - 1
    document.getElementById("direction").textContent = snakeDirection
}

function gameOver() {
    clearInterval(movementInterval)
    gameOverModal.classList.remove("hidden")
    document.removeEventListener("keydown")
}

// game event listenners

// detect key press event listener 
document.addEventListener("keydown", (event) => {
    if (!gameOverModal.classList.contains("hidden")) {
        return
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        const newDirection = event.key.replace("Arrow", "").toLowerCase()

        // prevent the snake from moving backwards
        if (
            (newDirection === "up" && snakeDirection !== "down") ||
            (newDirection === "down" && snakeDirection !== "up") ||
            (newDirection === "left" && snakeDirection !== "right") ||
            (newDirection === "right" && snakeDirection !== "left")
        ) {
            snakeDirection = newDirection
        }

        clearInterval(movementInterval)
        movementInterval = setInterval(move, 200)
    }
})

// restart button event listener
restartButton.addEventListener("click", () => {
    gameOverModal.classList.add("hidden")
    startGame()
})