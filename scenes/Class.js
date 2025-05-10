export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경
        const bg = this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0);

        // 중앙 상단 텍스트 ('학파 선택') - JejuHallasan 폰트 적용
        const titleText = this.add.text(width / 2, height * 0.1, '학파 선택', {
            fontFamily: 'JejuHallasan',
            fontSize: `${Math.floor(height * 0.06)}px`,
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // 우측 상단 backspace 버튼
        const backButton = this.add.image(width * 0.95, height * 0.1, 'class_backspace')
            .setOrigin(1, 0.5)
            .setInteractive();

        const biw = this.textures.get('class_backspace').getSourceImage().width;
        const backScale = Math.min((width * 0.08) / biw, 1);
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

        // 우측 하단 location 버튼
        const locationButton = this.add.image(width * 0.95, height * 0.95, 'button_location')
            .setOrigin(1, 1)
            .setInteractive();

        const liw = this.textures.get('button_location').getSourceImage().width;
        const locationScale = Math.min((width * 0.08) / liw, 1);
        locationButton.setScale(locationScale);

        let locationPressed = false;
        locationButton.on('pointerdown', () => {
            locationPressed = true;
            locationButton.setTint(0xaaaaaa);
        });
        locationButton.on('pointerup', (pointer) => {
            if (locationPressed && locationButton.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.start('Location');
            }
            locationPressed = false;
            locationButton.clearTint();
        });
        locationButton.on('pointerout', () => {
            locationPressed = false;
            locationButton.clearTint();
        });
    }
}
