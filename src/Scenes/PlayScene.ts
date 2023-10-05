import { SpriteWithDynamicBody } from "../types"

class PlayScene extends Phaser.Scene {

    player: SpriteWithDynamicBody

    get gameHeight() {
        return this.game.config.height as number
    }

    constructor() {
        super("PlayScene")
    }

    create() {
        this.createEnvironment()
        this.createPlayer()
        this.registerPlayerControl()
    }

    createEnvironment() {
        this.add.tileSprite(0, this.gameHeight, 88, 26, 'ground').setOrigin(0, 1)
    }

    createPlayer() {
        this.player = this.physics.add.sprite(0, this.gameHeight, 'dino-idle').setOrigin(0, 1)

        this.player.setGravityY(500).setCollideWorldBounds(true).setBodySize(44, 92)
    }

    registerPlayerControl() {
        const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        spaceBar.on('down', () => {
            this.player.setVelocityY(-300)
        })
    }
    
}

export default PlayScene