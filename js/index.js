window.onload = () => {
  const myObstacles = [];

  const myGameArea = {
    canvas: document.getElementById('canvas'),
    context: this.canvas.getContext('2d'),
    drawRoad: function () {
      const roadImg = new Image();
      roadImg.src = './images/road.png';
      const that = this;
      // roadImg.onload = function () {
      // console.log(this, that)
      that.context.drawImage(roadImg, 0, 0, 500, 700);
      // }
    },
    frames: 0,
    start: function () {
      this.interval = requestAnimationFrame(updateGameArea);
    },
    clear: function () {
      this.context.clearRect(0, 0, 500, 700);
    },
    stop: function () {
      cancelAnimationFrame(this.interval);
    },
    score: function () {
      const points = Math.floor(this.frames / 5);
      this.context.font = '18px serif';
      this.context.fillStyle = 'black';
      this.context.fillText(`Score: ${points}`, 350, 50);
    },
  }

  const roadImg = new Image();
  roadImg.src = './images/road.png';
  roadImg.onload = function () {
    myGameArea.context.drawImage(roadImg, 0, 0, 500, 700);
  }

  class Component {
    constructor(width, height, color, x, y, isCar = false) {
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;
      this.isCar = isCar;
    }

    update() {
      const ctx = myGameArea.context;
      if (this.isCar) {
        const carImg = new Image();
        carImg.src = './images/car.png';
        // carImg.onload = function () {
        ctx.drawImage(carImg, this.x, 500, 85, 165);
        // }
      } else {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }

    newPos() {
      this.x += this.speedX;
      this.y += this.speedY;
    }

    left() {
      return this.x;
    }
    right() {
      return this.x + this.width;
    }
    top() {
      return this.y;
    }
    bottom() {
      return this.y + this.height;
    }

    crashWith(obstacle) {
      return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
    }
  }

  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  const car = new Component(30, 30, 'red', 210, 500, true);

  function startGame() {
    console.log('start yo!');
    myGameArea.start();
  }

  function updateGameArea() {
    console.log('loop');
    myGameArea.clear();
    myGameArea.drawRoad();
    car.newPos();
    car.update();
    updateObstacles();

    myGameArea.interval = requestAnimationFrame(updateGameArea);
    checkGameOver();
    myGameArea.score();
  }

  document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      // case 38: // up arrow
      //   car.speedY -= 1;
      //   break;
      // case 40: // down arrow
      //   car.speedY += 1;
      //   break;
      case 37: // left arrow
        car.speedX -= 1;
        break;
      case 39: // right arrow
        car.speedX += 1;
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    car.speedX = 0;
    car.speedY = 0;
  });

  function updateObstacles() {
    for (let i = 0; i < myObstacles.length; i++) {
      myObstacles[i].y += 1;
      myObstacles[i].update();
    }

    myGameArea.frames += 1;
    if (myGameArea.frames % 120 === 0) {
      // let x = myGameArea.canvas.width;
      let y = 0;
      let minHeight = 20;
      let maxHeight = 350;
      let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      let minGap = 50;
      let maxGap = 200;
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      // left - ex: up
      // Component(width, height, color, x, y)
      myObstacles.push(new Component(height, 50, 'green', 50 + gap, y));
      // right - ex: down
      // myObstacles.push(new Component(y - height - gap, 50, 'green', height + gap, 500));
    }
  }

  function checkGameOver() {
    const crashed = myObstacles.some(function (obstacle) {
      return car.crashWith(obstacle);
    });

    if (crashed) {
      myGameArea.stop();
    }
  }

};