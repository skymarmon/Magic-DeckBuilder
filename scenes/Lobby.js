export default class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경 이미지 설정
        const bg = this.add.image(width / 2, height / 2, 'main').setAlpha(0);
        const iw = this.textures.get('main').getSourceImage().width;
        const ih = this.textures.get('main').getSourceImage().height;
        const scale = Math.min(width / iw, height / ih);
        bg.setScale(scale);

        this.tweens.add({
            targets: bg,
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
        });

        const displayWidth = iw * scale;
        const displayHeight = ih * scale;

        // 기준 위치 (배경 기준 우측 하단)
        const baseX = width / 2 + displayWidth / 2;
        const baseY = height / 2 + displayHeight / 2;

        // 버튼 위치 조정
        const button_start = this.add.image(baseX - 180, baseY - 230, 'button_start').setInteractive();
        button_start.setScale(0.7);
        button_start.on('pointerdown', () => this.scene.start('Class'));

        const button_research = this.add.image(baseX - 300, baseY - 120, 'button_research').setInteractive();
        button_research.setScale(0.5);
        button_research.on('pointerdown', () => this.scene.start('Research'));

        const button_record = this.add.image(baseX - 140, baseY - 120, 'button_record').setInteractive();
        button_record.setScale(0.5);
        button_record.on('pointerdown', () => this.scene.start('Record'));
    }
}
