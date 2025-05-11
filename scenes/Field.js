export default class Field extends Phaser.Scene {
    constructor() {
        super('Field');
    }

    init(data) {
        this.fromLocation = data.fromLocation || false;
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        this.cameras.main.setBackgroundColor('#000000');

        if (this.fromLocation) {
            this.cameras.main.fadeIn(1000, 0, 0, 0);
        }

        const worldSize = 100000;
        this.physics.world.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // 플레이어
        this.player = this.physics.add.image(0, 0, 'field_character');
        this.player.setCollideWorldBounds(true);
        this.player.setDamping(true);
        this.player.setDrag(0.95);
        this.player.setMaxVelocity(200);

        const charOriginalWidth = this.textures.get('field_character').getSourceImage().width;
        const charScale = Math.min((width * 0.035) / charOriginalWidth, 1);
        this.player.setScale(charScale);

        this.cameras.main.startFollow(this.player, true, 0.35, 0.35);
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // RenderTexture를 사용한 시각적 배경 렌더링
        this.rt = this.add.renderTexture(0, 0, width, height)
            .setOrigin(0)
            .setScrollFactor(0);

        this.rt.setDepth(-1);

        // 그라데이션 스타일
        this.roomRadius = 400;
        this.corridorWidth = 240;
        this.roomDistance = 2400;

        this.graphics = this.make.graphics({ x: 0, y: 0, add: false });
    }

    update() {
        const speed = 200;
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown) vx = -speed;
        else if (this.cursors.right.isDown) vx = speed;

        if (this.cursors.up.isDown) vy = -speed;
        else if (this.cursors.down.isDown) vy = speed;

        this.player.setVelocity(vx, vy);

        this.updateRenderTexture();
    }

    updateRenderTexture() {
        const cam = this.cameras.main;
        const { width, height } = this.sys.game.canvas;

        this.rt.clear();
        this.graphics.clear();

        // 검은 배경
        this.graphics.fillStyle(0x000000, 1);
        this.graphics.fillRect(0, 0, width, height);

        // 방과 복도 계산
        const viewLeft = cam.scrollX;
        const viewTop = cam.scrollY;
        const viewRight = cam.scrollX + width;
        const viewBottom = cam.scrollY + height;

        const nMin = Math.floor((viewLeft + this.roomDistance / 2) / this.roomDistance);
        const nMax = Math.ceil((viewRight + this.roomDistance / 2) / this.roomDistance);
        const mMin = Math.floor((viewTop + this.roomDistance / 2) / this.roomDistance);
        const mMax = Math.ceil((viewBottom + this.roomDistance / 2) / this.roomDistance);

        for (let n = nMin; n <= nMax; n++) {
            for (let m = mMin; m <= mMax; m++) {
                const cx = n * this.roomDistance;
                const cy = m * this.roomDistance;

                const localX = cx - cam.scrollX;
                const localY = cy - cam.scrollY;

                // 방
                const gradient = this.graphics.createRadialGradient(localX, localY, this.roomRadius * 0.7, localX, localY, this.roomRadius);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                this.graphics.fillStyle(gradient);
                this.graphics.fillCircle(localX, localY, this.roomRadius);

                // 복도: 가로
                const gradH = this.graphics.createLinearGradient(
                    localX - this.roomDistance / 2, localY,
                    localX + this.roomDistance / 2, localY
                );
                gradH.addColorStop(0, 'rgba(255,255,255,0)');
                gradH.addColorStop(0.5, 'rgba(255,255,255,1)');
                gradH.addColorStop(1, 'rgba(255,255,255,0)');
                this.graphics.fillStyle(gradH);
                this.graphics.fillRect(localX - this.roomDistance / 2, localY - this.corridorWidth / 2, this.roomDistance, this.corridorWidth);

                // 복도: 세로
                const gradV = this.graphics.createLinearGradient(
                    localX, localY - this.roomDistance / 2,
                    localX, localY + this.roomDistance / 2
                );
                gradV.addColorStop(0, 'rgba(255,255,255,0)');
                gradV.addColorStop(0.5, 'rgba(255,255,255,1)');
                gradV.addColorStop(1, 'rgba(255,255,255,0)');
                this.graphics.fillStyle(gradV);
                this.graphics.fillRect(localX - this.corridorWidth / 2, localY - this.roomDistance / 2, this.corridorWidth, this.roomDistance);
            }
        }

        // 렌더링 결과를 rt에 복사
        this.rt.draw(this.graphics);
    }
}
