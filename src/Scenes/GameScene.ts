export class GameScene extends Phaser.Scene {

    isGameRunning: boolean = false

    get gameWidth() {
        return this.game.config.width as number
    }

    get gameHeight() {
        return this.game.config.height as number
    }

    constructor(key: string){
        super(key)
    }
}