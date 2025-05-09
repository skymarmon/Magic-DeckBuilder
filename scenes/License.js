export default class License extends Phaser.Scene {
    constructor() {
        super('License');
    }

    create() {
        const image = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'credit').setAlpha(0);

        const ih = this.textures.get('credit').getSourceImage().height;

        const scaleX = window.innerHeight / ih;
        const scaleY = window.innerHeight / ih;
        const scale = Math.min(scaleX, scaleY);

        image.setScale(scale);

        this.tweens.add({
            targets: image,
            alpha: 1,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            hold: 2000,
            onComplete: () => this.scene.start('Lobby')
        });

        this.scene.start('Lobby', { fromLicense: true });
    }
}
