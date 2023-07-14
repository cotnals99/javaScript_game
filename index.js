const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Define canvas size
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.1;

const scaledCanvas = {
    height: canvas.height / 4,
    widht: canvas.width / 4
}

const floorCollisions2D = []
for (i=0; i < floorCollisions.length; i+=36 ) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y)=>{
    row.forEach((symbol, x) => {
        if (symbol === 202 ) {
            // console.log('Draw a block here!')
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16
                    }
                })
            )
        }
    })
})

const platformCollisions2D = []
for (i=0; i < platformCollisions.length; i+=36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y)=>{
    row.forEach((symbol, x) => {
        if (symbol === 202 ) {
            // console.log('Draw a block here!')
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16
                    },
                    height: 4
                })
            )
        }
    })
})


const player = new Player({
    position: {
        x: 100,
        y: 300,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    frameBuffer: 4,
    animations: {
      Idle: {
        imageSrc: './img/warrior/Idle.png',
        frameRate: 8,
        frameBuffer: 5,
      },
      Run: {
        imageSrc: './img/warrior/Run.png',
        frameRate: 8,
        frameBuffer: 5,
      },
      Jump: {
        imageSrc: './img/warrior/Jump.png',
        frameRate: 2,
        frameBuffer: 3,
      },
      Fall: {
        imageSrc: './img/warrior/Fall.png',
        frameRate: 2,
        frameBuffer: 3,
      },
      FallLeft: {
        imageSrc: './img/warrior/FallLeft.png',
        frameRate: 2,
        frameBuffer: 3,
      },
      RunLeft: {
        imageSrc: './img/warrior/RunLeft.png',
        frameRate: 8,
        frameBuffer: 5,
      },
      IdleLeft: {
        imageSrc: './img/warrior/IdleLeft.png',
        frameRate: 8,
        frameBuffer: 5,
      },
      JumpLeft: {
        imageSrc: './img/warrior/JumpLeft.png',
        frameRate: 2,
        frameBuffer: 3,
      },
    }
});


const keys = {
  d: {
    pressed: false,
  },

  a: {
    pressed: false,
  },
};

const background = new Sprite({
    position: {
      x: 0,
      y: 0,
    },
    imageSrc: "./img/background.png",
  });
  


const backgroundImageHeight = 432

const camera = {
  position: {
    x:0,
    y: -backgroundImageHeight + scaledCanvas.height
  }
}  


//Animate function
function animate() {
  window.requestAnimationFrame(animate);

  // drawing rectangle
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.save();
//Scale the contents coming after scale function only!
//Therefore, this means scale the background image.
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y)
  background.update();

//drawing collisionblocks
  // collisionBlocks.forEach((collisionBlock) => { 
  //   collisionBlock.update()
  // })

  // platformCollisionBlocks.forEach((block) => { 
  //   block.update()
  // })


  player.checkForHorizontalCanvasCollision()
  player.checkForVerticalCanvasCollision()
  player.update();
  player.velocity.x = 0;
  if (keys.d.pressed) {
    player.switchSprite('Run')
    player.velocity.x = 1.5
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({canvas, camera})
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -1.5
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({canvas, camera})
  }
  else if (player.velocity.y === 0 ) {
    if (player.lastDirection === 'right' ) {
    player.switchSprite('Idle')
    } else player.switchSprite('IdleLeft')
  }

  if(player.velocity.y < 0) {
    player.shouldPanCameraDown({canvas, camera})
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  }
  else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({canvas, camera})
    if (player.lastDirection === 'right') player.switchSprite('Fall')
    else player.switchSprite('FallLeft')
  }

  c.restore();
  

}

animate();


// User Movement
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      player.velocity.y = -3;
    default:
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    default:
      break;
  }
});
