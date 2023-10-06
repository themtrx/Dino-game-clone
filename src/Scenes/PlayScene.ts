import { PRELOAD_CONFIG } from ".."
import { Player } from "../entities/Player"
import { SpriteWithDynamicBody } from "../types"
import { GameScene } from "./GameScene"

class PlayScene extends GameScene {
    ground: Phaser.GameObjects.TileSprite
    obsticles: Phaser.GameObjects.Group
    player: Player
    startTrigger: SpriteWithDynamicBody

    spawnInterval: number = 1500
    spawnTime: number = 0
    gameSpeed: number = 7

    constructor() {
        super("PlayScene")
    }

    create() {
        this.createEnvironment()
        this.createPlayer()

        this.obsticles = this.physics.add.group()

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

    spawnObsticle() {
        const obsticleNumber = Math.floor(Math.random() * PRELOAD_CONFIG.cacutsesCount) + 1
        const distance = Phaser.Math.Between(600, 1000)

        this.obsticles
            .create(distance, this.gameHeight, `obsticle-${obsticleNumber}`)
            .setOrigin(0, 1)
    }
    
}

export default PlayScene