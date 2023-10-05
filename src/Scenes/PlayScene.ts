import { Player } from "../entities/Player"
import { SpriteWithDynamicBody } from "../types"

class PlayScene extends Phaser.Scene {

    ground: Phaser.GameObjects.TileSprite
    player: Player
    startTrigger: SpriteWithDynamicBody

    get gameWidth() {
        return this.game.config.width as number
    }

    get gameHeight() {
        return this.game.config.height as number
    }

    constructor() {
        super("PlayScene")
    }

    create() {
        this.createEnvironment()
        this.createPlayer()

        this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0, 1).setAlpha(0)

        this.physics.add.overlap(this.startTrigger, this.player, () => {
            if(this.startTrigger.y == 10){
                this.startTrigger.body.reset(0, this.gameHeight)
                return
            }

            this.startTrigger.body.reset(9999, 9999)

            this.time.addEvent({
                delay: 1000 / 60,
                loop: true,
                callback: () => {
                    if(this.ground.width <= this.gameWidth){
                        this.ground.width += (17 *2)
                    }
                }
            })
            
        })
    }

    createEnvironment() {
        this.ground = this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1)
    }

    createPlayer() {
        this.player = new Player(this, 0, this.gameHeight)
    }

    update(time: number, delta: number) {

    }
    
}

export default PlayScene