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

        // 버튼 미리 생성
        const button_start = this.add.image(baseX - 400, baseY - 230, 'button_start').setScale(0.7).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        button_start.on('pointerdown', () => this.scene.start('Class'));

        const button_research = this.add.image(baseX - 270, baseY - 120, 'button_research').setScale(0.5).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        button_research.on('pointerdown', () => this.scene.start('Research'));

        const button_record = this.add.image(baseX - 110, baseY - 120, 'button_record').setScale(0.5).setAlpha(this.fromLicense ? 0 : 1).setInteractive();
        button_record.on('pointerdown', () => this.scene.start('Record'));

        // 배경 투명도
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
