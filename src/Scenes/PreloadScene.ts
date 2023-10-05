import Phaser from "phaser"

class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene")
    }

    preload() {
        this.load.image("ground", "ground.png")
        this.load.image("dino-idle", "dino-idle-2.png")
        
        this.load.spritesheet("dino-run", "dino-run.png", { frameWidth: 88, frameHeight: 94 })
    }

    create() {
        this.scene.start("PlayScene")
    }
}

export default PreloadScene