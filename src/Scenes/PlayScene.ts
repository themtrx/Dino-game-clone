import Phaser from "phaser"

class PlayScene extends Phaser.Scene {
    constructor() {
        super("PlayScene")
    }

    create() {
        alert("Hello World!")
    }
}

export default PlayScene