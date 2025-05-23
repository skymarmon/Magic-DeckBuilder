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

        this.cameras.main.startFollow(this.player, true, 0.35, 0.35);
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.rt = this.add.renderTexture(0, 0, width, height).setOrigin(0).setScrollFactor(0).setDepth(-1);

        this.roomRadius = 1000;
        this.corridorWidth = 720;
        this.roomDistance = 3200;

        this.createGradientCircleTexture();
        this.createCorridorWallTexture();

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

        const dt = this.game.loop.delta / 1000;
        const nextX = this.player.x + vx * dt;
        const nextY = this.player.y + vy * dt;

        // X방향 이동이 장애물에 걸리는 경우, 실제 이동 방향과 비교 후 차단
        if (this.isBlocked(nextX, this.player.y)) {
            // 플레이어가 오른쪽으로 이동하려 하면 vx=0, 왼쪽이면 vx=0
            if ((vx > 0 && nextX > this.player.x) || (vx < 0 && nextX < this.player.x)) {
                vx = 0;
            }
        }

        // Y방향 이동이 장애물에 걸리는 경우, 실제 이동 방향과 비교 후 차단
        if (this.isBlocked(this.player.x, nextY)) {
            if ((vy > 0 && nextY > this.player.y) || (vy < 0 && nextY < this.player.y)) {
                vy = 0;
            }
        }

        this.player.setVelocity(vx, vy);

        this.updateRenderTexture();
    }

    updateRenderTexture() {
        const cam = this.cameras.main;
        const { width, height } = this.sys.game.canvas;

        this.rt.clear();

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

                // 방 그라데이션
                this.rt.draw('room_gradient', localX - this.roomRadius, localY - this.roomRadius);

                // 수평 복도
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(
                    localX - this.roomDistance / 2,
                    localY - this.corridorWidth / 2,
                    this.roomDistance,
                    this.corridorWidth
                );
                this.rt.draw(this.graphics);

                // 수평 복도 그라데이션 (짧은 쪽, 좌우 가장자리)
                this.rt.draw('corridor_gradient_horizontal', localX - this.roomDistance / 2, localY - this.corridorWidth / 2);

                // 수직 복도
                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(
                    localX - this.corridorWidth / 2,
                    localY - this.roomDistance / 2,
                    this.corridorWidth,
                    this.roomDistance
                );
                this.rt.draw(this.graphics);

                // 수직 복도 그라데이션 (짧은 쪽, 위아래 가장자리)
                this.rt.draw('corridor_gradient_vertical', localX - this.corridorWidth / 2, localY - this.roomDistance / 2);
            }
        }
    }

    createGradientCircleTexture() {
        const diameter = this.roomRadius * 2;
        const canvas = this.textures.createCanvas('room_gradient', diameter, diameter);
        const ctx = canvas.getContext();

        const innerRadius = this.roomRadius * 0.9;

        const gradient = ctx.createRadialGradient(
            this.roomRadius,
            this.roomRadius,
            innerRadius,
            this.roomRadius,
            this.roomRadius,
            this.roomRadius
        );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.roomRadius, this.roomRadius, this.roomRadius, 0, Math.PI * 2);
        ctx.fill();

        canvas.refresh();
    }

    createCorridorWallTexture() {
        const gradThickness = 100; // 그라데이션 두께 확대

        // 수평 복도 그라데이션 (짧은 쪽 벽 좌/우)
        const h = this.corridorWidth;
        const w = this.roomDistance;
        const canvasH = this.textures.createCanvas('corridor_gradient_horizontal', w, h);
        const ctxH = canvasH.getContext();

        const gradientH = ctxH.createLinearGradient(0, 0, gradThickness, 0);
        gradientH.addColorStop(0, 'rgba(255,255,255,1)');
        gradientH.addColorStop(1, 'rgba(255,255,255,0)');
        ctxH.fillStyle = gradientH;
        ctxH.fillRect(0, 0, gradThickness, h);

        const gradientH2 = ctxH.createLinearGradient(w - gradThickness, 0, w, 0);
        gradientH2.addColorStop(0, 'rgba(255,255,255,0)');
        gradientH2.addColorStop(1, 'rgba(255,255,255,1)');
        ctxH.fillStyle = gradientH2;
        ctxH.fillRect(w - gradThickness, 0, gradThickness, h);

        canvasH.refresh();

        // 수직 복도 그라데이션 (짧은 쪽 벽 위/아래)
        const canvasV = this.textures.createCanvas('corridor_gradient_vertical', h, w);
        const ctxV = canvasV.getContext();

        const gradientV = ctxV.createLinearGradient(0, 0, 0, gradThickness);
        gradientV.addColorStop(0, 'rgba(255,255,255,1)');
        gradientV.addColorStop(1, 'rgba(255,255,255,0)');
        ctxV.fillStyle = gradientV;
        ctxV.fillRect(0, 0, h, gradThickness);

        const gradientV2 = ctxV.createLinearGradient(0, w - gradThickness, 0, w);
        gradientV2.addColorStop(0, 'rgba(255,255,255,0)');
        gradientV2.addColorStop(1, 'rgba(255,255,255,1)');
        ctxV.fillStyle = gradientV2;
        ctxV.fillRect(0, w - gradThickness, h, gradThickness);

        canvasV.refresh();
    }

    isBlocked(x, y) {
        const rx = Math.round(x / this.roomDistance);
        const ry = Math.round(y / this.roomDistance);
        const cx = rx * this.roomDistance;
        const cy = ry * this.roomDistance;

        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const inRoom = dist <= this.roomRadius;
        const inHorizontal = Math.abs(dy) <= this.corridorWidth / 2 && Math.abs(dx) <= this.roomDistance / 2;
        const inVertical = Math.abs(dx) <= this.corridorWidth / 2 && Math.abs(dy) <= this.roomDistance / 2;

        return !(inRoom || inHorizontal || inVertical);
    }
}
