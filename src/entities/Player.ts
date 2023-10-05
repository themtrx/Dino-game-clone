import { GameScene } from "../Scenes/GameScene"

export class Player extends Phaser.Physics.Arcade.Sprite {

    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    scene: GameScene

    constructor(scene: GameScene, x: number, y: number){
        super(scene, x, y, 'dino-idle')

        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.init()
    }

    init() {
        this.cursors = this.scene.input.keyboard.createCursorKeys()

        this
            .setOrigin(0, 1)
            .setGravityY(2000)
            .setCollideWorldBounds(true)
            .setBodySize(44, 92)

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
        this.registerAnimations()
    }

    update() {
        const { space } = this.cursors
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space)

        const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor()

        if(isSpaceJustDown && onFloor){
            this.setVelocityY(-1000)
        }

        if(this.scene.isGameRunning){
            return
        }

        if(this.body.deltaAbsY() > 0){
            this.anims.stop()
            this.setTexture('dino-run', 0)
        }else {
            this.playRunAnimation()
        }
    }

    playRunAnimation() {
        this.play('run', true)
    }

    registerAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino-run', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
    }

}