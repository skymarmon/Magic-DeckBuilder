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

        const baseX = width / 2 + displayWidth / 2;
        const baseY = height / 2 + displayHeight / 2;

        const button_start = this.add.image(baseX - 440, baseY - 230, 'button_start').setScale(0.7).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        let startPressed = false;
        button_start.on('pointerdown', () => {
            startPressed = true;
            button_start.setTint(0xaaaaaa);
        });
        button_start.on('pointerup', (pointer) => {
            if (startPressed && button_start.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.start('Class');
            }
            startPressed = false;
            button_start.clearTint();
        });
        button_start.on('pointerout', () => {
            startPressed = false;
            button_start.clearTint();
        });

        const button_research = this.add.image(baseX - 270, baseY - 120, 'button_research').setScale(0.5).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        let researchPressed = false;
        button_research.on('pointerdown', () => {
            researchPressed = true;
            button_research.setTint(0xaaaaaa);
        });
        button_research.on('pointerup', (pointer) => {
            if (researchPressed && button_research.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.start('Research');
            }
            researchPressed = false;
            button_research.clearTint();
        });
        button_research.on('pointerout', () => {
            researchPressed = false;
            button_research.clearTint();
        });

        const button_record = this.add.image(baseX - 110, baseY - 120, 'button_record').setScale(0.5).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        let recordPressed = false;
        button_record.on('pointerdown', () => {
            recordPressed = true;
            button_record.setTint(0xaaaaaa);
        });
        button_record.on('pointerup', (pointer) => {
            if (recordPressed && button_record.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.start('Record');
            }
            recordPressed = false;
            button_record.clearTint();
        });
        button_record.on('pointerout', () => {
            recordPressed = false;
            button_record.clearTint();
        });

        if (this.fromLicense) {
            bg.setAlpha(0);

            this.tweens.add({
                targets: [bg, button_start, button_research, button_record],
                alpha: 1,
                duration: 1000,
                ease: 'Linear'
            });
        }
    }
}
