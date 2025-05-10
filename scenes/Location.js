export default class Location extends Phaser.Scene {
    constructor() {
        super('Location');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경
        this.add.rectangle(0, 0, width, height, 0x111111).setOrigin(0);

        // location_name 이미지 (중앙 상단)
        const name = this.add.image(width / 2, height * 0.13, 'location_name').setOrigin(0.5);
        const nameScale = Math.min((width * 0.3) / name.width, 1);
        name.setScale(nameScale);

        // location_info 이미지 (중앙 하단 위쪽)
        const info = this.add.image(width / 2, height * 0.75, 'location_info').setOrigin(0.5);
        const infoScale = Math.min((width * 0.43) / info.width, 1);
        info.setScale(infoScale);

        // button_game 이미지 (맨 아래 중앙)
        const gameButton = this.add.image(width / 2, height * 0.9, 'button_game').setOrigin(0.5).setInteractive();
        const gameScale = Math.min((width * 0.3) / gameButton.width, 1);
        gameButton.setScale(gameScale);

        // 버튼 클릭 이벤트
        let gamePressed = false;
        gameButton.on('pointerdown', () => {
            gamePressed = true;
            gameButton.setTint(0xaaaaaa);
        });
        gameButton.on('pointerup', (pointer) => {
            if (gamePressed && gameButton.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.start('Field');
            }
            gamePressed = false;
            gameButton.clearTint();
        });
        gameButton.on('pointerout', () => {
            gamePressed = false;
            gameButton.clearTint();
        });
    }
}