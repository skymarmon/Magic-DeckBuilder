import { updateClassTint, class_, class_level, now_class as global_now_class } from '../main.js';

export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경
        this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0);

        // 기본 클래스 설정
        if (global_now_class === '') {
            global_now_class = 'wizard';
        }

        // 중앙 상단 텍스트
        const titleText = this.add.text(width / 2, height * 0.1, '학파 선택', {
            fontFamily: 'JejuHallasan',
            fontSize: `${Math.floor(width * 0.04)}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // 우측 상단 뒤로가기 버튼
        const backButton = this.add.image(width * 0.95, height * 0.1, 'class_backspace')
            .setOrigin(1, 0.5)
            .setInteractive();
        const backScale = Math.min((width * 0.08) / this.textures.get('class_backspace').getSourceImage().width, 1);
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

        // 우측 하단 Location 버튼
        const locationButton = this.add.image(width * 0.95, height * 0.95, 'button_location')
            .setOrigin(1, 1)
            .setInteractive();
        const locScale = Math.min((width * 0.08) / this.textures.get('button_location').getSourceImage().width, 1);
        locationButton.setScale(locScale);

        let locPressed = false;
        locationButton.on('pointerdown', () => {
            locPressed = true;
            locationButton.setTint(0xaaaaaa);
        });
        locationButton.on('pointerup', (pointer) => {
            if (locPressed && locationButton.getBounds().contains(pointer.x, pointer.y)) {
                this.scene.start('Location');
            }
            locPressed = false;
            locationButton.clearTint();
        });
        locationButton.on('pointerout', () => {
            locPressed = false;
            locationButton.clearTint();
        });

        // 좌측 상단 wizard 클래스 버튼
        const wizardButton = this.add.image(width * 0.05, height * 0.1, 'class_wizard')
            .setOrigin(0, 0.5)
            .setInteractive();
        const wizScale = Math.min((width * 0.08) / this.textures.get('class_wizard').getSourceImage().width, 1);
        wizardButton.setScale(wizScale);

        class_['wizard'] = wizardButton;

        let wizardPressed = false;

        wizardButton.on('pointerdown', () => {
            wizardPressed = true;
            updateClassTint('wizard', wizardPressed);
        });
        wizardButton.on('pointerup', (pointer) => {
            if (wizardPressed && wizardButton.getBounds().contains(pointer.x, pointer.y)) {
                global_now_class = 'wizard';
                // 모든 클래스 버튼 tint 업데이트
                for (const key in class_) {
                    updateClassTint(key, false);
                }
            }
            wizardPressed = false;
            updateClassTint('wizard', false);
        });
        wizardButton.on('pointerout', () => {
            wizardPressed = false;
            updateClassTint('wizard', false);
        });

        // 초기 tint 설정
        updateClassTint('wizard', false);
    }
}
