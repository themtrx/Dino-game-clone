import Phaser from "phaser"
import { PRELOAD_CONFIG } from "..";

class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene")
    }

    preload() {
        this.load.image("ground", "ground.png")
        this.load.image("dino-idle", "dino-idle-2.png")

        for (let i = 0; i < PRELOAD_CONFIG.cacutsesCount; i++) {
            const cactusNum = i + 1
            this.load.image(`obsticle-${cactusNum}`, `cactuses_${cactusNum}.png`)
        }

        this.load.spritesheet("dino-run", "dino-run.png", { frameWidth: 88, frameHeight: 94 })
    }

    create() {
        this.scene.start("PlayScene")
    }
}

export default PreloadScene