import { updateClassTint } from './main';

export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        if (!window.now_class) window.now_class = 'wizard';
        if (!window.class_level) window.class_level = {};
        if (!window.class_) window.class_ = {};

        const bg = this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0);

        // 중앙 상단 텍스트
        const title = this.add.text(width / 2, height * 0.1, '학파 선택', {
            fontFamily: 'JejuHallasan',
            fontSize: `${Math.round(height * 0.05)}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // backspace 버튼 (우상단)
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
                this.scene.start('Lobby', { fromLicense: false });
            }
            backPressed = false;
            backButton.clearTint();
        });

        backButton.on('pointerout', () => {
            backPressed = false;
            backButton.clearTint();
        });

        // location 버튼 (우하단)
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

        // wizard 버튼 (좌상단)
        let wizardPressed = false;
        const wizardButton = this.add.image(width * 0.05, height * 0.1, 'class_wizard')
            .setOrigin(0, 0.5)
            .setInteractive();

        const wiw = this.textures.get('class_wizard').getSourceImage().width;
        const wizardScale = Math.min((width * 0.08) / wiw, 1);
        wizardButton.setScale(wizardScale);

        wizardButton.on('pointerdown', () => {
            wizardPressed = true;
            updateClassTint('wizard', true);
        });

        wizardButton.on('pointerup', (pointer) => {
            if (wizardPressed && wizardButton.getBounds().contains(pointer.x, pointer.y)) {
                now_class = 'wizard';
            }
            wizardPressed = false;
            updateClassTint('wizard', false);
        });

        wizardButton.on('pointerout', () => {
            wizardPressed = false;
            updateClassTint('wizard', false);
        });

        updateClassTint('wizard', false);
    }
}
