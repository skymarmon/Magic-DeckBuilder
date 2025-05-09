export default class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }

    init(data) {
        this.fromLicense = data.fromLicense || false;
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        const bg = this.add.image(width / 2, height / 2, 'main');
        const iw = this.textures.get('main').getSourceImage().width;
        const ih = this.textures.get('main').getSourceImage().height;
        const scale = Math.min(width / iw, height / ih);
        bg.setScale(scale);

        const displayWidth = iw * scale;
        const displayHeight = ih * scale;
        console.log(width, height);

        const baseX = width / 2 + displayWidth / 2;
        const baseY = height / 2 + displayHeight / 2;

        const button_start = this.add.image(baseX - 0.26 * width, baseY - 0.26 * height, 'button_start').setScale(2.1 * scale).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        button_start.on('pointerdown', () => button_start.setTint(0xaaaaaa));
        button_start.on('pointerup', () => {
            button_start.clearTint();
            this.scene.start('Class');
        });
        button_start.on('pointerout', () => button_start.clearTint());

        const button_research = this.add.image(baseX - 0.16 * width, baseY - 0.13 * height, 'button_research').setScale(1.5 * scale).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        button_research.on('pointerdown', () => button_research.setTint(0xaaaaaa));
        button_research.on('pointerup', () => {
            button_research.clearTint();
            this.scene.start('Research');
        });
        button_research.on('pointerout', () => button_research.clearTint());

        const button_record = this.add.image(baseX - 0.06 * width, baseY - 0.13 * height, 'button_record').setScale(1.5 * scale).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        button_record.on('pointerdown', () => button_record.setTint(0xaaaaaa));
        button_record.on('pointerup', () => {
            button_record.clearTint();
            this.scene.start('Record');
        });
        button_record.on('pointerout', () => button_record.clearTint());

        if (this.fromLicense) {
            bg.setAlpha(0);
            button_start.setAlpha(0);
            button_research.setAlpha(0);
            button_record.setAlpha(0);

            this.tweens.add({
                targets: [bg, button_start, button_research, button_record],
                alpha: 1,
                duration: 1000,
                ease: 'Linear'
            });
        }
    }
}
