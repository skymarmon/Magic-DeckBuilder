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

        this.player = this.physics.add.image(0, 0, 'field_character');
        this.player.setCollideWorldBounds(true);
        this.player.setDamping(true);
        this.player.setDrag(0.95);
        this.player.setMaxVelocity(200);

        const charOriginalWidth = this.textures.get('field_character').getSourceImage().width;
        const charScale = Math.min((width * 0.035) / charOriginalWidth, 1);
        this.player.setScale(charScale);

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setLerp(1, 1);
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.rt = this.add.renderTexture(0, 0, width, height).setOrigin(0).setScrollFactor(0).setDepth(-1);
        this.graphics = this.make.graphics({ x: 0, y: 0, add: false });

        this.roomRadius = 1400;
        this.corridorWidth = 720;
        this.roomDistance = 3200;

        this.prevTileRange = { nMin: 0, nMax: 0, mMin: 0, mMax: 0 };
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

        const viewLeft = cam.scrollX;
        const viewTop = cam.scrollY;
        const viewRight = cam.scrollX + width;
        const viewBottom = cam.scrollY + height;

        const nMin = Math.floor((viewLeft) / this.roomDistance);
        const nMax = Math.ceil((viewRight) / this.roomDistance);
        const mMin = Math.floor((viewTop) / this.roomDistance);
        const mMax = Math.ceil((viewBottom) / this.roomDistance);

        // 동일한 타일 범위면 렌더링 생략 (선택 사항)
        const prev = this.prevTileRange;
        if (nMin === prev.nMin && nMax === prev.nMax && mMin === prev.mMin && mMax === prev.mMax) return;
        this.prevTileRange = { nMin, nMax, mMin, mMax };

        this.rt.clear();

        for (let n = nMin; n <= nMax; n++) {
            for (let m = mMin; m <= mMax; m++) {
                const cx = n * this.roomDistance;
                const cy = m * this.roomDistance;

                // 방
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillCircle(cx, cy, this.roomRadius);
                this.rt.draw(this.graphics, -cam.scrollX, -cam.scrollY);

                // 수평 복도
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(cx - this.roomDistance / 2, cy - this.corridorWidth / 2, this.roomDistance, this.corridorWidth);
                this.rt.draw(this.graphics, -cam.scrollX, -cam.scrollY);

                // 수직 복도
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(cx - this.corridorWidth / 2, cy - this.roomDistance / 2, this.corridorWidth, this.roomDistance);
                this.rt.draw(this.graphics, -cam.scrollX, -cam.scrollY);
            }
        }
    }
}