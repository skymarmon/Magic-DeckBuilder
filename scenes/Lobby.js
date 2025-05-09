export default class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경 이미지
        const bg = this.add.image(width / 2, height / 2, 'main').setAlpha(0);

        // 화면 비율에 맞게 배경 축소
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

        // 버튼 간 간격
        const spacing = 100;
        const buttonScale = 0.5;
        const startY = height - spacing * 3;

        // 버튼 생성 및 배치
        const buttons = [
            { key: 'button_start', scene: 'Class' },
            { key: 'button_research', scene: 'Research' },
            { key: 'button_record', scene: 'Record' }
        ];

        buttons.forEach((btn, index) => {
            const button = this.add.image(width - 80, startY + spacing * index, btn.key).setInteractive();
            button.setScale(buttonScale);

            button.on('pointerdown', () => {
                this.scene.start(btn.scene);
            });
        });
    }
}