document.addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById("game-board");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const colorSelect = document.getElementById("color-select");
    const gridSize = 20;
    const gameSize = 400;
    const initialSnakeLength = 3;
    const snakeSpeed = 200; // Tempo de atualização em milissegundos
    const directions = {
        UP: "up",
        DOWN: "down",
        LEFT: "left",
        RIGHT: "right"
    };

    let snake = [];
    let food = null;
    let currentDirection = directions.RIGHT;
    let gameLoop;
    let isGameRunning = false; // Variável para controlar se o jogo está em andamento

    function startGame() {
        if (isGameRunning) {
            return; // Se o jogo já estiver em andamento, não iniciar novamente
        }

        isGameRunning = true; // Definir a variável de controle como verdadeira
        createSnake();
        createFood();
        gameLoop = setInterval(moveSnake, snakeSpeed);
        document.addEventListener("keydown", changeDirection);
        startButton.disabled = true;
        restartButton.disabled = true;
    }

    function createSnake() {
        for (let i = 0; i < initialSnakeLength; i++) {
            const snakePart = createSnakePart(i * gridSize, 0);
            snake.push(snakePart);
            gameBoard.appendChild(snakePart);
        }
    }

    function createSnakePart(x, y) {
        const snakePart = document.createElement("div");
        snakePart.classList.add("snake-part");

        let snakeColor;

        if (colorSelect.value === "colorido") {
            snakeColor = generateRandomColor();
        } else {
            snakeColor = colorSelect.value;
        }

        snakePart.style.backgroundColor = snakeColor;
        snakePart.style.left = x + "px";
        snakePart.style.top = y + "px";
        return snakePart;
    }

    function generateRandomColor() {
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createFood() {
        const foodX = getRandomPosition();
        const foodY = getRandomPosition();
        food = document.createElement("div");
        food.id = "food";
        food.style.left = foodX + "px";
        food.style.top = foodY + "px";
        gameBoard.appendChild(food);
    }

    function getRandomPosition() {
        return Math.floor(Math.random() * gameSize / gridSize) * gridSize;
    }

    function moveSnake() {
        const head = snake[snake.length - 1];
        const newHead = getNextSnakePart(head);

        if (isCollision(newHead)) {
            endGame();
            return;
        }

        snake.push(newHead);
        gameBoard.appendChild(newHead);

        if (!isEatingFood(newHead)) {
            const tail = snake.shift();
            gameBoard.removeChild(tail);
        }
    }

    function getNextSnakePart(head) {
        const { left, top } = head.style;
        let newLeft = parseInt(left, 10);
        let newTop = parseInt(top, 10);

        switch (currentDirection) {
            case directions.UP:
                newTop -= gridSize;
                break;
            case directions.DOWN:
                newTop += gridSize;
                break;
            case directions.LEFT:
                newLeft -= gridSize;
                break;
            case directions.RIGHT:
                newLeft += gridSize;
                break;
        }

        return createSnakePart(newLeft, newTop);
    }

    function isCollision(snakePart) {
        const { left, top } = snakePart.style;

        if (parseInt(left, 10) < 0 ||
            parseInt(left, 10) >= gameSize ||
            parseInt(top, 10) < 0 ||
            parseInt(top, 10) >= gameSize) {
            return true;
        }

        for (let i = 0; i < snake.length - 1; i++) {
            if (snake[i].style.left === left && snake[i].style.top === top) {
                return true;
            }
        }

        return false;
    }

    function isEatingFood(snakePart) {
        const { left, top } = snakePart.style;

        if (left === food.style.left && top === food.style.top) {
            gameBoard.removeChild(food);
            createFood();
            return true;
        }

        return false;
    }

    function changeDirection(event) {
        switch (event.keyCode) {
            case 37: // Left arrow key
                if (currentDirection !== directions.RIGHT) {
                    currentDirection = directions.LEFT;
                }
                break;
            case 38: // Up arrow key
                if (currentDirection !== directions.DOWN) {
                    currentDirection = directions.UP;
                }
                break;
            case 39: // Right arrow key
                if (currentDirection !== directions.LEFT) {
                    currentDirection = directions.RIGHT;
                }
                break;
            case 40: // Down arrow key
                if (currentDirection !== directions.UP) {
                    currentDirection = directions.DOWN;
                }
                break;
        }
    }

    function endGame() {
        clearInterval(gameLoop);
        document.removeEventListener("keydown", changeDirection);
        startButton.disabled = true;
        restartButton.disabled = false;
        isGameRunning = false; // Definir a variável de controle como falsa
        alert("Fim de Jogo! Pontuação: " + (snake.length - initialSnakeLength));
    }

    function restartGame() {
        while (snake.length > 0) {
            const snakePart = snake.pop();
            gameBoard.removeChild(snakePart);
        }

        if (food !== null) {
            gameBoard.removeChild(food);
            food = null;
        }

        currentDirection = directions.RIGHT;
        startButton.disabled = false;
        restartButton.disabled = true;
    }

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", restartGame);
});
