const game = document.getElementById("game");
const ctx = game.getContext("2d");

game.width = 500;
game.height = 500;

let rightPressed = false;
let leftPressed = false;

const keyDownHandler = (e) => {
    if (e.key == "Right" || e.key == "ArrowRight")
        rightPressed = true;
    else if (e.key == "Left" || e.key == "ArrowLeft")
        leftPressed = true;
}

const keyUpHandler = (e) => {
    if (e.key == "Right" || e.key == "ArrowRight")
        rightPressed = false;
    else if (e.key == "Left" || e.key == "ArrowLeft")
        leftPressed = false;
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

let speed = 3;

let ball = {
    x: game.width / 2,
    y: game.height - 50,
    dx: speed,
    dy: -speed + 1,
    radius: 7,
    draw: function () {
        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    },
};

let paddle = {
    height: 10,
    width: 76,
    x: (game.width - 76) / 2,
    draw: function () {
        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.rect(this.x, game.height - this.height, this.width, this.height);
        ctx.closePath();
        ctx.fill();
    }
}

const movePaddle = () => {
    if (rightPressed && paddle.x + paddle.width <= game.width)
        paddle.x += 7;
    else if (leftPressed && paddle.x >= 0)
        paddle.x -= 7;
}

let brickRowCount = 3;
let brickColCount = 5;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 20;
let brickOffsetTop = 30;
let brickOffsetLeft = 35;

let bricks = [];

const generateBricks = () => {
    for (let i = 0; i < brickRowCount; i++) {
        bricks[i] = [];
        for (let j = 0; j < brickColCount; j++) {
            bricks[i][j] = {x: 0, y: 0, status: 1,}
        }
    }
}

const drawBricks = () => {
    for (let i = 0; i < brickRowCount; i++) {
        for (let j = 0; j < brickColCount; j++) {

            let brickX = j * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = i * (brickHeight + brickPadding) + brickOffsetTop;

            if (ball.y >= brickY && ball.y <= brickY + brickHeight && ball.x >= brickX && ball.x <= brickX + brickWidth && bricks[i][j].status === 1) {
                ball.dy *= -1;
                bricks[i][j].status = 0;
            }

            if (ball.y <= brickY && ball.y >= brickY + brickHeight && ball.x <= brickX && ball.x >= brickX + brickWidth && bricks[i][j].status === 1) {
                ball.dx *= -1;
                bricks[i][j].status = 0;
            }

            if (bricks[i][j].status === 1) {
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.fillStyle = "#FFF";
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}

const play = () => {

    ctx.clearRect(0, 0, game.width, game.height)

    ball.draw();
    paddle.draw();

    drawBricks();

    movePaddle();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > game.width || ball.x - ball.radius < 0)
        ball.dx *= -1;

    if (ball.y + ball.radius > game.height || ball.y - ball.radius < 0)
        ball.dy *= -1;

    if (
        ball.y + ball.radius > game.height - paddle.height &&
        (ball.x + ball.radius >= paddle.x && ball.x + ball.radius <= paddle.x + paddle.width)
    ) ball.dy *= -1;

    requestAnimationFrame(play);
}

generateBricks();
play();