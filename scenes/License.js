export default class License extends Phaser.Scene {
    constructor() {
        super('License');
    }

    create() {
        const image = this.add.image(640, 360, 'credit').setAlpha(0);
        this.tweens.add({
            targets: image,
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
            yoyo: true,
            hold: 2000,
            onComplete: () => this.scene.start('Lobby')
        });
    }
}