import { PRELOAD_CONFIG } from ".."
import { Player } from "../entities/Player"
import { SpriteWithDynamicBody } from "../types"
import { GameScene } from "./GameScene"

class PlayScene extends GameScene {
    ground: Phaser.GameObjects.TileSprite
    obsticles: Phaser.GameObjects.Group
    clouds: Phaser.GameObjects.Group
    player: Player
    startTrigger: SpriteWithDynamicBody

    scoreText: Phaser.GameObjects.Text
    gameOverContainer: Phaser.GameObjects.Container
    gameOverText: Phaser.GameObjects.Image
    restartText: Phaser.GameObjects.Image

    score: number = 0
    scoreInterval: number = 100
    scoreDeltaTime: number = 0

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
        this.createScore()

        this.handleGameStart()
        this.handleObsticleCollisions()
        this.handleGameRestart()
    }

    update(time: number, delta: number) {
        if(!this.isGameRunning) return

        this.spawnTime += delta
        this.scoreDeltaTime += delta

        if(this.scoreDeltaTime >= this.scoreInterval){
            this.score += 1
            this.scoreDeltaTime = 0
        }

        if(this.spawnTime >= this.spawnInterval){
            this.spawnTime = 0
            this.spawnObsticle()
        }

        Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed)
        Phaser.Actions.IncX(this.clouds.getChildren(), -0.7)

        const score = Array.from(String(this.score), Number)
        for (let i = 0; i < 5-String(this.score).length; i++) {
            score.unshift(0)
        }

        this.scoreText.setText(score.join(''))

        this.obsticles.getChildren().forEach((obsticle: SpriteWithDynamicBody) => {
            if(obsticle.getBounds().right < 0){
                this.obsticles.remove(obsticle)
            }
        })

        this.clouds.getChildren().forEach((cloud: SpriteWithDynamicBody) => {
            if(cloud.getBounds().right < 0){
                cloud.x = this.gameWidth + 30
            }
        })


        this.ground.tilePositionX += this.gameSpeed
    }

    createEnvironment() {
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1)
        
        this.clouds = this.add.group()
        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth /2, 170, 'cloud'),
            this.add.image(this.gameWidth - 80, 80, 'cloud'),
            this.add.image(this.gameWidth /1.3, 100, 'cloud'),
        ])

        this.clouds.setAlpha(0)
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

    createScore() {
        this.scoreText = this.add.text(this.gameWidth, 0, '00000', {
            fontSize: 30,
            fontFamily: 'Arial',
            color: '#535353',
            resolution: 5
        }).setOrigin(1, 0).setAlpha(0)
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
                        this.clouds.setAlpha(1)
                        this.scoreText.setAlpha(1)
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
            this.scoreDeltaTime = 0
            this.gameSpeed = 7
        })
    }
    
}

export default PlayScene