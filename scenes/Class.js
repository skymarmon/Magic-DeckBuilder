let now_class = ''; // 전역 변수

export default class Class extends Phaser.Scene {
    constructor() {
        super('Class');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // now_class 값이 없으면 기본값으로 'wizard' 설정
        if (!now_class) {
            now_class = 'wizard';
        }

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

        // 좌측 상단 wizard 버튼
        const wizardButton = this.add.image(width * 0.05, height * 0.1, 'class_wizard')
            .setOrigin(0, 0.5)
            .setInteractive();

        const wiw = this.textures.get('class_wizard').getSourceImage().width;
        const wizardScale = Math.min((width * 0.08) / wiw, 1);
        wizardButton.setScale(wizardScale);

        let wizardPressed = false;
        wizardButton.on('pointerdown', () => {
            wizardPressed = true;
            wizardButton.setTint(0xaaaaaa);
        });
        wizardButton.on('pointerup', (pointer) => {
            if (wizardPressed && wizardButton.getBounds().contains(pointer.x, pointer.y)) {
                now_class = 'wizard'; // 클릭 시 wizard 값 할당
                this.updateWizardButtonColor(wizardButton); // wizard 버튼 색상 업데이트
            }
            wizardPressed = false;
            wizardButton.clearTint();
        });
        wizardButton.on('pointerout', () => {
            wizardPressed = false;
            wizardButton.clearTint();
        });

        // wizard 버튼 색상 업데이트 (now_class 값에 따른 색 변경)
        this.updateWizardButtonColor(wizardButton);
    }

    updateWizardButtonColor(button) {
        if (now_class === 'wizard') {
            button.setTint(0xFFFFCC); // 연한 노란색
        } else {
            button.clearTint();
        }
    }
}
