import { PRELOAD_CONFIG } from ".."
import { Player } from "../entities/Player"
import { SpriteWithDynamicBody } from "../types"
import { GameScene } from "./GameScene"

class PlayScene extends GameScene {
    ground: Phaser.GameObjects.TileSprite
    obsticles: Phaser.GameObjects.Group
    player: Player
    startTrigger: SpriteWithDynamicBody

    gameOverContainer: Phaser.GameObjects.Container
    gameOverText: Phaser.GameObjects.Image
    restartText: Phaser.GameObjects.Image

    spawnInterval: number = 1500
    spawnTime: number = 0
    gameSpeed: number = 7

    constructor() {
        super("PlayScene")
    }

    create() {
        this.createEnvironment()
        this.createPlayer()
        this.createObsticles()
        this.createGameOverContainer()
        this.createAnimations()

        this.handleGameStart()
        this.handleObsticleCollisions()
        this.handleGameRestart()
    }

    update(time: number, delta: number) {
        if(!this.isGameRunning) return

        this.spawnTime += delta

        if(this.spawnTime >= this.spawnInterval){
            this.spawnTime = 0
            this.spawnObsticle()
        }

        Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed)

        this.obsticles.getChildren().forEach((obsticle: SpriteWithDynamicBody) => {
            if(obsticle.getBounds().right < 0){
                this.obsticles.remove(obsticle)
            }
        })

        this.ground.tilePositionX += this.gameSpeed
    }

    createEnvironment() {
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1)
    }

    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight)
    }

    createObsticles() {
        this.obsticles = this.physics.add.group()
    }

    createGameOverContainer() {
        this.gameOverText = this.add.image(0, 0, 'game-over')
        this.restartText = this.add.image(0, 80, 'restart').setInteractive()

        this.gameOverContainer = this.add
                .container(this.gameWidth /2, (this.gameHeight /2) - 50, [this.gameOverText, this.restartText])
                .setAlpha(0)
    }

    createAnimations() {
        this.anims.create({
            key: 'enemy-bird-fly',
            frames: this.anims.generateFrameNumbers('enemy-bird'),
            frameRate: 6,
            repeat: -1
        })
    }

    spawnObsticle() {
        const obsitclesCount =  PRELOAD_CONFIG.cacutsesCount + PRELOAD_CONFIG.birdsCount
        const obsticleNumber = Math.floor(Math.random() * obsitclesCount) + 1

        const distance = Phaser.Math.Between(150, 300)
        let obsticle = null

        if(obsticleNumber > PRELOAD_CONFIG.cacutsesCount){
            const enemyPossibleHeight = [20, 70]
            const enemyHeight = enemyPossibleHeight[Math.floor(Math.random() * enemyPossibleHeight.length) ]

            obsticle = this.obsticles.create(this.gameWidth + distance, this.gameHeight - enemyHeight, `enemy-bird`)
            obsticle.setBodySize(45, 30)

            obsticle.play('enemy-bird-fly', true)
        } else {
            obsticle = this.obsticles.create(this.gameWidth + distance, this.gameHeight, `obsticle-${obsticleNumber}`)
        }

        obsticle.setOrigin(0, 1).setImmovable()
    }

    handleGameStart() {
        this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0, 1).setAlpha(0)

        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if(this.startTrigger.y == 10){
                this.startTrigger.body.reset(0, this.gameHeight)
                return
            }

            this.startTrigger.body.reset(9999, 9999)

            const rollOutEvent = this.time.addEvent({
                delay: 1000 / 60,
                loop: true,
                callback: () => {
                    this.player.playRunAnimation()
                    this.player.setVelocityX(80)
                    this.ground.width += (17 *2)

                    if(this.ground.width >= this.gameWidth){
                        this.player.setVelocityX(0)
                        rollOutEvent.remove()
                        this.isGameRunning = true
                    }
                }
            })
            
        })
    }   

    handleGameRestart() {
        this.restartText.on('pointerdown', () => {
            this.physics.resume()
            this.player.setVelocityY(0)

            this.obsticles.clear(true, true)
            this.gameOverContainer.setAlpha(0)
            this.anims.resumeAll()

            this.isGameRunning = true
        })
    }

    handleObsticleCollisions() {
        this.physics.add.collider(this.player, this.obsticles, () => {
            this.isGameRunning = false
            this.physics.pause()
            this.anims.pauseAll()

            this.player.die()
            this.gameOverContainer.setAlpha(1)
            this.spawnTime = 0
            this.gameSpeed = 7
        })
    }
    
}

export default PlayScene