//Player Class
class Player extends Sprite {
  constructor({ position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, frameBuffer, scale = 0.5, animations }) {
    super({imageSrc, frameRate, frameBuffer, scale})
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    // this.width = 100 / 4;
    // this.height = 100 / 4;
    this.collisionBlocks = collisionBlocks
    this.platformCollisionBlocks = platformCollisionBlocks
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10
    }

    this.animations = animations
    this.lastDirection = 'right'

    for (let key in this.animations) {
      const image = new Image()
      image.src = this.animations[key].imageSrc

      this.animations[key].image = image
    }

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: 200,
      height: 80
    }
  }

  updateCamerabox(){
    this.camerabox = {
      position: {
        x: this.position.x - 55,
        y: this.position.y
      },
      width: 200,
      height: 80
    }
  }

  checkForHorizontalCanvasCollision(){
    if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 || this.hitbox.position.x + this.velocity.x <= 0){
      this.velocity.x = 0
    }
  }

  checkForVerticalCanvasCollision(){
    if (this.hitbox.position.y + this.hitbox.height + this.velocity.y >= backgroundImageHeight || this.hitbox.position.y + this.velocity.y <= 0){
      this.velocity.y = 0
    }
  }

  shouldPanCameraToTheLeft({canvas, camera}){
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
    const scaledDownCanvasWidth = canvas.width / 4

    if (cameraboxRightSide >= 576) return

    if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)){
      camera.position.x -= this.velocity.x
    }
  }

  shouldPanCameraToTheRight({canvas, camera}){
    if (this.camerabox.position.x <= 0) return
    if (this.camerabox.position.x <= Math.abs(camera.position.x)){
      camera.position.x -= this.velocity.x
    }
  }

  shouldPanCameraDown({canvas, camera}){
    if (this.camerabox.position.y + this.velocity.y <= 0) return

    if (this.camerabox.position.y <= Math.abs(camera.position.y)){
      camera.position.y -= this.velocity.y
    }
  }

  shouldPanCameraUp({canvas, camera}){
    const scaledCanvasHeight = canvas.height / 4

    if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return

    if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvasHeight){
      camera.position.y -= this.velocity.y
    }
  }


  switchSprite(key){
    if (this.image === this.animations[key].image || !this.loaded ) return

    this.currentFrame = 0
    this.image = this.animations[key].image
    this.frameBuffer = this.animations[key].frameBuffer
    this.frameRate = this.animations[key].frameRate
  }

//   draw() {
//     c.fillStyle = "red";
//     c.fillRect(this.position.x, this.position.y, this.width, this.height);
//   }





  update() {
    this.updateFrames()
    this.updateHitbox()

    this.updateCamerabox()

    //Draw out the image
    // c.fillStyle = 'rgba(0, 255, 0, 0.2'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)


    //Draw out the hitbox
    // c.fillStyle = 'rgba(255, 0, 0, 0.2'
    // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)


    //Draw out the camerabox
    // c.fillStyle = 'rgba(0, 0, 255, 0.2'
    // c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)


    this.draw();
    this.position.x += this.velocity.x;
    //   this.position.y += this.velocity.y;
    //   if (this.position.y + this.height + this.velocity.y < canvas.height)
    //     this.velocity.y += gravity;
    //   else this.velocity.y = 0;

    this.updateHitbox()
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox()
    this.checkForVerticalCollisions();
  }

  updateHitbox(){
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
          // this.position.x = collisionBlock.position.x - this.width - 0.01;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          const offset = this.hitbox.position.x - this.position.x
          // this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01;
          this.position.x = collisionBlock.position.x+ collisionBlock.width - offset + 0.01;
        break
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {

    //collisionBlock
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        collision({
          object1: this.hitbox,
          object2: collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

          // this.position.y = collisionBlock.position.y - this.height - 0.01;
          this.position.y = collisionBlock.position.y - offset - 0.01;

          break
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y

          // this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
          this.position.y = collisionBlock.position.y + collisionBlock.height  -offset + 0.01;
          break
        }
      }
    }

    //platform collision block
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];

      if (
        platformCollision({
          object1: this.hitbox,
          object2: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

          // this.position.y = platformCollisionBlock.position.y - this.height - 0.01;
          this.position.y = platformCollisionBlock.position.y - offset - 0.01;

          break
        }
      }
    }
  }
}
