// Class.js

import { updateClassTint, class_, class_level, getNowClass, setNowClass } from '../main.js';

export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경
        this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

        // 기본 클래스 설정
        if (getNowClass() === '') {
            setNowClass('wizard');
        }

        // 중앙 상단 텍스트
        this.add.text(width / 2, height * 0.1, '학파 선택', {
            fontFamily: 'JejuHallasan',
            fontSize: `${Math.floor(width * 0.04)}px`,
            color: '#ffffff'
        }).setOrigin(0.5);

        // 뒤로가기 버튼
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
                this.scene.start('Lobby', fromLicense = false);
            }
            backPressed = false;
            backButton.clearTint();
        });
        backButton.on('pointerout', () => {
            backPressed = false;
            backButton.clearTint();
        });

        // Location 버튼
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

        // Wizard 클래스 버튼
        const wizardButton = this.add.image(width * 0.05, height * 0.1, 'class_wizard').setOrigin(0, 0.5);
        const wizScale = Math.min((width * 0.08) / this.textures.get('class_wizard').getSourceImage().width, 1);
        wizardButton.setScale(wizScale);
        class_['wizard'] = wizardButton;

        if (class_level['wizard'] > 0) {
            wizardButton.setInteractive();
            let wizardPressed = false;
            wizardButton.on('pointerdown', () => {
                wizardPressed = true;
                updateClassTint('wizard', wizardPressed);
            });
            wizardButton.on('pointerup', (pointer) => {
                if (wizardPressed && wizardButton.getBounds().contains(pointer.x, pointer.y)) {
                    setNowClass('wizard');
                    for (const key in class_) updateClassTint(key, false);
                }
                wizardPressed = false;
                updateClassTint('wizard', false);
            });
            wizardButton.on('pointerout', () => {
                wizardPressed = false;
                updateClassTint('wizard', false);
            });
        }

        // Astronomer 클래스 버튼
        const astronomerButton = this.add.image(width * 0.13, height * 0.1, 'class_astronomer').setOrigin(0, 0.5);
        const astrScale = Math.min((width * 0.08) / this.textures.get('class_astronomer').getSourceImage().width, 1);
        astronomerButton.setScale(astrScale);
        class_['astronomer'] = astronomerButton;

        if (class_level['astronomer'] > 0) {
            astronomerButton.setInteractive();
            let astronomerPressed = false;
            astronomerButton.on('pointerdown', () => {
                astronomerPressed = true;
                updateClassTint('astronomer', astronomerPressed);
            });
            astronomerButton.on('pointerup', (pointer) => {
                if (astronomerPressed && astronomerButton.getBounds().contains(pointer.x, pointer.y)) {
                    setNowClass('astronomer');
                    for (const key in class_) updateClassTint(key, false);
                }
                astronomerPressed = false;
                updateClassTint('astronomer', false);
            });
            astronomerButton.on('pointerout', () => {
                astronomerPressed = false;
                updateClassTint('astronomer', false);
            });
        }

        // 초기 tint 설정
        updateClassTint('wizard', false);
        updateClassTint('astronomer', false);
    }
}
