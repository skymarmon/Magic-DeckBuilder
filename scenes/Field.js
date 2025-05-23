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

        this.roomRadius = 1400;
        this.corridorWidth = 720;
        this.roomDistance = 3200;

        this.graphics = this.make.graphics({ x: 0, y: 0, add: false });

        this.rt = this.add.renderTexture(
            -worldSize / 2,
            -worldSize / 2,
            worldSize,
            worldSize
        ).setScrollFactor(1).setDepth(-1);

        this.renderStaticBackground();
    }

    update() {
        const speed = 200;
        let vx = 0;
        let vy = 0;
        const px = this.player.x;
        const py = this.player.y;
        const step = 5; // 충돌 예측 거리

        if (this.cursors.left.isDown && this.isPassable(px - step, py)) vx = -speed;
        else if (this.cursors.right.isDown && this.isPassable(px + step, py)) vx = speed;

        if (this.cursors.up.isDown && this.isPassable(px, py - step)) vy = -speed;
        else if (this.cursors.down.isDown && this.isPassable(px, py + step)) vy = speed;

        this.player.setVelocity(vx, vy);
    }

    isPassable(x, y) {
        const r = this.roomRadius;
        const d = this.roomDistance;
        const w = this.corridorWidth;

        const nx = Math.round(x / d);
        const ny = Math.round(y / d);
        const cx = nx * d;
        const cy = ny * d;

        // 방 내부 판정
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= r * r) return true;

        // 수평 복도
        if (Math.abs(y - cy) < w / 2 && Math.abs(x - cx) < d / 2) return true;

        // 수직 복도
        if (Math.abs(x - cx) < w / 2 && Math.abs(y - cy) < d / 2) return true;

        return false;
    }

    renderStaticBackground() {
        const nMin = Math.floor(-50000 / this.roomDistance);
        const nMax = Math.ceil(50000 / this.roomDistance);
        const mMin = Math.floor(-50000 / this.roomDistance);
        const mMax = Math.ceil(50000 / this.roomDistance);

        for (let n = nMin; n <= nMax; n++) {
            for (let m = mMin; m <= mMax; m++) {
                const cx = n * this.roomDistance;
                const cy = m * this.roomDistance;

                // 방
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillCircle(cx, cy, this.roomRadius);
                this.rt.draw(this.graphics);

                // 수평 복도
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(cx - this.roomDistance / 2, cy - this.corridorWidth / 2, this.roomDistance, this.corridorWidth);
                this.rt.draw(this.graphics);

                // 수직 복도
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(cx - this.corridorWidth / 2, cy - this.roomDistance / 2, this.corridorWidth, this.roomDistance);
                this.rt.draw(this.graphics);
            }
        }
    }
}
