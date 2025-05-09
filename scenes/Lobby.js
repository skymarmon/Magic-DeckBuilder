export default class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경 이미지 생성 및 비율 유지 확대
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

        // 실제 표시된 배경의 크기 계산
        const displayWidth = iw * scale;
        const displayHeight = ih * scale;

        // 배경 안쪽 기준으로 버튼 위치 계산
        const rightX = width / 2 + displayWidth / 2 - 100;
        const bottomY = height / 2 + displayHeight / 2 - 100;
        const spacing = 100;
        const buttonScale = 0.5;

        const buttons = [
            { key: 'button_start', scene: 'Class' },
            { key: 'button_research', scene: 'Research' },
            { key: 'button_record', scene: 'Record' }
        ];

        buttons.forEach((btn, index) => {
            const button = this.add.image(rightX, bottomY - spacing * index, btn.key).setInteractive();
            button.setScale(buttonScale);

            button.on('pointerdown', () => {
                this.scene.start(btn.scene);
            });
        });
    }
}
