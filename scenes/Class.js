export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경
        const bg = this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0);

        // 중앙 상단 텍스트 (text_choose_class)
        const text = this.add.image(width / 2, height * 0.1, 'text_choose_class');
        const iw = this.textures.get('text_choose_class').getSourceImage().width;
        const ih = this.textures.get('text_choose_class').getSourceImage().height;
        const scale = Math.min((width * 0.3) / iw, 1); // 최대 60% 너비
        text.setScale(scale);

        // 우측 상단 backspace 버튼
        const backButton = this.add.image(width * 0.95, height * 0.1, 'class_backspace')
            .setOrigin(1, 0.5)
            .setScale(scale * 0.5)
            .setInteractive();

        const biw = this.textures.get('class_backspace').getSourceImage().width;
        const backScale = Math.min((width * 0.08) / biw, 1); // 최대 8% 너비
        backButton.setScale(backScale);

        let backPressed = false;

        backButton.on('pointerdown', () => {
            backPressed = true;
            backButton.setTint(0xaaaaaa);
        });

        backButton.on('pointerup', (pointer) => {
            if (backPressed && backButton.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.start('Lobby');
            }
            backPressed = false;
            backButton.clearTint();
        });

        backButton.on('pointerout', () => {
            backPressed = false;
            backButton.clearTint();
        });
    }
}
