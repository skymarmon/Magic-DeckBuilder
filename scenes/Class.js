import { updateClassTint, class_, class_level, class_name, getNowClass, setNowClass } from '../main.js';

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

        this.classTitleText = this.add.text(width * 0.8, height * 0.13, class_name[getNowClass()] || "Class Selection", {
            fontFamily: 'JejuHallasan',
            fontSize: `${Math.floor(width * 0.04)}px`,
            color: '#ffffff'
        }).setOrigin(0.5);


        // 뒤로가기 버튼
        const backButton = this.add.image(width * 0.97, height * 0.07, 'class_backspace')
            .setOrigin(1, 0.5)
            .setInteractive();
        const backScale = Math.min((width * 0.05) / this.textures.get('class_backspace').getSourceImage().width, 1);
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

        // Location 버튼
        const locationButton = this.add.image(width * 0.9, height * 0.9, 'button_location')
            .setOrigin(1, 1)
            .setInteractive();
        const locScale = Math.min((width * 0.2) / this.textures.get('button_location').getSourceImage().width, 1);
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

        // 클래스 목록 (4행 6열)
        const classGrid = [
            ['wizard', 'astronomer', 'cryomancer', 'shaman', 'warlock', 'arcanist'],
            ['summoner', 'bishop', 'occultist', 'druid', 'pyromancer', 'sorcerer'],
            ['alchemist', 'scholar', 'witch', 'electromancer', 'arbiter', 'archmage'],
            ['archaeologist', 'magician', 'mage', 'battlemage', 'warlord', 'blackmage']
        ];

        const colCount = 6;
        const rowCount = 4;
        const xStart = width * 0.05;
        const xGap = width * 0.09;
        const yStart = height * 0.22;
        const yGap = height * 0.18;

        classGrid.forEach((row, rowIndex) => {
            row.forEach((classname, colIndex) => {
                const x = xStart + xGap * colIndex;
                const y = yStart + yGap * rowIndex;

                const button = this.add.image(x, y, `class_${classname}`).setOrigin(0, 0.5);
                const scale = Math.min((width * 0.08) / this.textures.get(`class_${classname}`).getSourceImage().width, 1);
                button.setScale(scale);
                class_[classname] = button;

                if (class_level[classname] > 0) {
                    button.setInteractive();
                    let pressed = false;
                    button.on('pointerdown', () => {
                        pressed = true;
                        updateClassTint(classname, true);
                    });
                    button.on('pointerup', (pointer) => {
                        if (pressed && button.getBounds().contains(pointer.x, pointer.y)) {
                            setNowClass(classname);
                            this.classTitleText.setText(class_name[classname] || "Class Selection");
                            for (const key in class_) updateClassTint(key, false);
                        }
                        pressed = false;
                        updateClassTint(classname, false);
                    });
                    button.on('pointerout', () => {
                        pressed = false;
                        updateClassTint(classname, false);
                    });
                }
            });
        });

        // 초기 tint 설정
        for (const row of classGrid) {
            for (const classname of row) {
                updateClassTint(classname, false);
            }
        }
    }
}
