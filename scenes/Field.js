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

        this.cameras.main.startFollow(this.player, true); // 즉시 따라감
        this.cameras.main.setLerp(1, 1); // 지연 없이
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.rt = this.add.renderTexture(0, 0, width, height).setOrigin(0).setScrollFactor(0).setDepth(-1);

        this.roomRadius = 500;
        this.corridorWidth = 720;
        this.roomDistance = 3200;

        this.createGradientCircleTexture();

        this.graphics = this.make.graphics({ x: 0, y: 0, add: false });

        this.obstacleLayer = this.make.image({
            key: '__WHITE',
            add: false,
            width: this.sys.game.canvas.width,
            height: this.sys.game.canvas.height,
        });

        this.obstacleMap = new Map();
    }

    update() {
        const speed = 200;
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown) vx = -speed;
        else if (this.cursors.right.isDown) vx = speed;
        if (this.cursors.up.isDown) vy = -speed;
        else if (this.cursors.down.isDown) vy = speed;

        // 방향별 이동 제한
        const tile = this.getTileType(this.player.x, this.player.y);
        if (this.getTileType(this.player.x + vx * this.game.loop.delta / 1000, this.player.y) === 'obstacle') vx = 0;
        if (this.getTileType(this.player.x, this.player.y + vy * this.game.loop.delta / 1000) === 'obstacle') vy = 0;

        this.player.setVelocity(vx, vy);
        this.updateRenderTexture();
    }

    updateRenderTexture() {
        const cam = this.cameras.main;
        const { width, height } = this.sys.game.canvas;

        this.rt.clear();
        this.obstacleMap.clear();

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

                // 방 그리기 (360도 그라데이션)
                this.rt.draw('room_gradient', localX - this.roomRadius, localY - this.roomRadius);

                // 복도 그리기
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                // 수평
                this.graphics.fillRect(localX - this.roomDistance / 2, localY - this.corridorWidth / 2, this.roomDistance, this.corridorWidth);
                // 수직
                this.graphics.fillRect(localX - this.corridorWidth / 2, localY - this.roomDistance / 2, this.corridorWidth, this.roomDistance);
                this.rt.draw(this.graphics);

                // 충돌 마스크용 기록
                for (let y = -this.roomRadius; y <= this.roomRadius; y += 20) {
                    for (let x = -this.roomRadius; x <= this.roomRadius; x += 20) {
                        const dist = Math.sqrt(x * x + y * y);
                        if (dist <= this.roomRadius) {
                            const px = Math.floor(cx + x);
                            const py = Math.floor(cy + y);
                            this.obstacleMap.set(`${px >> 6},${py >> 6}`, 'floor');
                        }
                    }
                }
                // 복도 충돌 해제
                for (let dx = -this.roomDistance / 2; dx <= this.roomDistance / 2; dx += 20) {
                    for (let dy = -this.corridorWidth / 2; dy <= this.corridorWidth / 2; dy += 20) {
                        this.obstacleMap.set(`${Math.floor((cx + dx) >> 6)},${Math.floor((cy + dy) >> 6)}`, 'floor');
                    }
                }
                for (let dx = -this.corridorWidth / 2; dx <= this.corridorWidth / 2; dx += 20) {
                    for (let dy = -this.roomDistance / 2; dy <= this.roomDistance / 2; dy += 20) {
                        this.obstacleMap.set(`${Math.floor((cx + dx) >> 6)},${Math.floor((cy + dy) >> 6)}`, 'floor');
                    }
                }
            }
        }
    }

    getTileType(x, y) {
        return this.obstacleMap.get(`${Math.floor(x >> 6)},${Math.floor(y >> 6)}`) || 'obstacle';
    }

    createGradientCircleTexture() {
        const diameter = this.roomRadius * 2;
        const canvas = this.textures.createCanvas('room_gradient', diameter, diameter);
        const ctx = canvas.getContext();

        const gradient = ctx.createRadialGradient(
            this.roomRadius,
            this.roomRadius,
            0,
            this.roomRadius,
            this.roomRadius,
            this.roomRadius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.roomRadius, this.roomRadius, this.roomRadius, 0, Math.PI * 2);
        ctx.fill();

        canvas.refresh();
    }
}
