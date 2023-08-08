const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");

//ball size
let circle_x = 160;
let circle_y = 160;
let radius = 20;

// ball move speed
let xSpeed = 20;
let ySpeed = 20;

// player's bar
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

//min, max
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// make all bricks
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

//when mouse move , bar move
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  //confirm whether ball touch Brick
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //change x, y direction and speed
      if (circle_y >= brick.y + brick.height) {
        //ball from bottom
        ySpeed *= -1;
      } else if (circle_y <= brick.y) {
        //ball from top
        ySpeed *= -1;
      } else if (circle_x >= brick.x + brick.width) {
        //ball from left
        xSpeed *= -1;
      } else if (circle_x <= brick.x) {
        //ball from right
        xSpeed *= -1;
      }
      //remove brick from brickArray
      //brickArray.splice(index, 1); //O(n)
      //   if (brickArray.length == 0) {
      //     alert("Game over！");
      //     clearInterval(game);
      //   }
      if (count == 10) {
        alert("Game over!");
        clearInterval(game);
        location.reload();
      }
    }
  });
  // confirm whether ball touch bar
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }
  //confirm whether ball touch boundary
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  if (circle_y <= radius) {
    ySpeed *= -1;
  }

  // change ball's location
  circle_x += xSpeed;
  circle_y += ySpeed;

  //draw black blackground
  ctx.fillStyle = "black";
  //draw rectangle
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //draw all bricks
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //draw palyer's bar
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //draw ball
  // x, y ,radius , startAngle ,endAngle
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
