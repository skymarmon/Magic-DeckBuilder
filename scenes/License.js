export default class License extends Phaser.Scene {
    constructor() {
        super('License');
    }

    create() {
        const image = this.add.image(window.innerWidth / 2, window.innerHeight / 2 + 150, 'credit').setAlpha(0);
        image.setScale(0.35);

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
