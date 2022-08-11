// Declare and assign variables.
let screenWidth;
let screenHeight;
let myTank = document.getElementById("myTank");
let gameArea = document.getElementById('gameArea');
let tankImages = [];
let elementBottom = 10;
let elementQuadraticSize = 100 + elementBottom;
let tankHalfSize = (elementQuadraticSize / 2.5);
let rotating = false;
let degree = 0;
let animationTime = 300;
let fps = 24;
let timers = [];
let tankDirection = null;
let bulletSpeed = 20;


const rotate2D = (element, value) => {
  rotating = true;
  element.style.transform = `rotate(${value}deg)`;
}
const currentDegrees = () => {
  if (!myTank.style.transform) {
    return 0;
  }
  return myTank.style.transform;
}
const onKeydown = (event) => {
  if (event.defaultPrevented) {
    return;
  }
  let executeUpdate = null;
  degree = currentDegrees();
  switch (event.keyCode) {
    case 87:
      if (degree !== 0) {
        rotate2D(myTank, 0);
      }
      executeUpdate = () => updateYPosition(myTank, 10);
      break;
    case 83:
      if (degree !== 180) {
        rotate2D(myTank, 180);
      }
      executeUpdate = () => updateYPosition(myTank, -10);
      break;
    case 68:
      if (degree !== 90) {
        rotate2D(myTank, 90);
      }
      executeUpdate = () => updateXPosition(myTank, 20);
      break;
    case 65:
      if (degree !== 90) {
        rotate2D(myTank, -90);
      }
      executeUpdate = () => updateXPosition(myTank, -20);
      break;
    case 32:
      shoot();
      break;
  }
  animateTankMovement();
    executeUpdate();
  // if (executeUpdate) {
  //   waitAnimation(executeUpdate);
  // }
  event.preventDefault();
}

let tankMoving = null;
let tankStopped = null;
let animationRequest = null;
const animateTankMovement = () => {
  if (tankMoving) {
    clearInterval(tankMoving);
    tankMoving = null;
  }
  tankMoving = setTimeout(() => {
    animate();
  }, 1000 / fps);

  if (tankStopped) {
    clearInterval(tankStopped);
    tankStopped = null;
    animationRequest = null;
  }
};
// Update y-axis position.
const updateYPosition = (element, distance) => {
  const elementPosition = element.getBoundingClientRect();
  let calc = elementPosition.top - distance;
  const newY = fixTankPositionByScreenBounds(calc, screenHeight);
  myTank.style.top = newY + 'px';
}
// Update x-axis position.
const updateXPosition = (element, distance) => {
  const elementPosition = myTank.getBoundingClientRect();
  const calc = elementPosition.x + distance;
  const newX = fixTankPositionByScreenBounds(calc, screenWidth);
  myTank.style.left = newX + 'px';
}

const fixTankPositionByScreenBounds = (value, border) => {
  if (value < 0) {
    value = 10;
  }
  if (border < value + elementQuadraticSize) {
    value = border - elementQuadraticSize;
  }
  return value;
}

const clearTimers = () => {
  if (timers.length) {
    timers.forEach(t => clearTimeout(t));
  }
  timers = [];
};
const waitAnimation = (func) => {
  clearTimers();
  const timer = setTimeout((func) => {
    if (!rotating) {
      func();
    }
    clearTimers();
    rotating = false;
  }, rotating ? animationTime : 0, func);
  timers.push(timer);
}
// game bounds area
const setGameAreaBounds = () => {
  screenWidth = innerWidth;
  screenHeight = innerHeight;
  gameArea.style.width = screenWidth + 'px';
  gameArea.style.width = screenHeight + 'px';
}
const addListeners = () => {
  window.addEventListener('load', setGameAreaBounds);
  window.addEventListener("keydown", onKeydown, true);
}

const animateMovingTank = () => {
  for (let i = 0; i < 5; i++) {
    tankImages[i] = new Image();
    tankImages[i].src = `assets/images/tank_default_${i}.svg`;
  }
}

let counter = 0;

function animate() {
  animateMovingTank();
  if (counter > tankImages.length - 1) {
    counter = 0;
  }
  myTank.src = tankImages[counter].src;
  counter++;
}

let bulletFlying = null;
const shoot = () => {
  let myBullet = document.getElementsByTagName('myBullet')[0];
  let centerX = myTank.offsetLeft + myTank.offsetWidth / 2;
  let centerY = myTank.offsetTop + myTank.offsetHeight / 2;
  let direction = currentDegrees();
  if (!myBullet) {
    myBullet = document.createElement('myBullet');
    myBullet.style.background = 'red';
    myBullet.style.position = 'absolute';
    myBullet.style.borderRadius = '50px';
    myBullet.style.width = elementBottom + 'px';
    myBullet.style.height = elementBottom + 'px';
    let top = null;
    let left = null;
    switch (direction) {
      case 'rotate(90deg)':
        top = -5;
        left = 50;
        break;
      case 'rotate(-90deg)':
        top = -5;
        left = -60;
        break
      case 'rotate(180deg)':
        top = 50;
        left = -5;
        break;
      case 'rotate(0deg)':
      default:
        left = -5;
        top = -60;
        break;
    }
    myBullet.style.left = centerX + left + 'px';
    myBullet.style.top = centerY + top + 'px';
    gameArea.appendChild(myBullet);
  }
  bulletFlying = setInterval(() => {
    let bulletY = myBullet.getBoundingClientRect().y;
    let bulletX = myBullet.getBoundingClientRect().x;
    myBullet.opacity = 1;
    switch (direction) {
      case 'rotate(90deg)':
        myBullet.style.left = bulletX + bulletSpeed + 'px';
        break;
      case 'rotate(-90deg)':
        myBullet.style.left = bulletX - bulletSpeed + 'px';
        break
      case 'rotate(180deg)':
        myBullet.style.top = bulletY + bulletSpeed + 'px';
        break;
      case 'rotate(0deg)':
      default:
        myBullet.style.top = bulletY - bulletSpeed + 'px';
        break;
    }
    if (bulletY <= 10 || bulletY >= screenHeight - 20 ||
      bulletX <= 10 || bulletX >= screenWidth - 20) {
      if (myBullet) {
        gameArea.removeChild(myBullet);
        myBullet = null;
        clearInterval(bulletFlying);
        bulletFlying = null;
      }
    }
    window.requestAnimationFrame(animate)
  }, 20);
}

addListeners();
animate();

