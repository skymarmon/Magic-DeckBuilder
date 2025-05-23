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

        this.roomRadius = 1000; // 반지름 2배
        this.corridorWidth = 720; // 짧은 쪽 길이 3배
        this.roomDistance = 1600;

        this.createGradientTextures();

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
                this.rt.draw('room_gradient', localX - this.roomRadius, localY - this.roomRadius);

                // 수평 복도
                this.rt.draw(
                    'h_corridor_gradient',
                    localX - this.roomDistance / 2,
                    localY - this.corridorWidth / 2
                );

                // 수직 복도
                this.rt.draw(
                    'v_corridor_gradient',
                    localX - this.corridorWidth / 2,
                    localY - this.roomDistance / 2
                );
            }
        }
    }

    createGradientTextures() {
        // 방 (원형 그라데이션)
        const diameter = this.roomRadius * 2;
        const roomCanvas = this.textures.createCanvas('room_gradient', diameter, diameter);
        const rctx = roomCanvas.getContext();

        const innerRadius = this.roomRadius * 0.8;
        const outerRadius = this.roomRadius;

        const gradient = rctx.createRadialGradient(
            this.roomRadius,
            this.roomRadius,
            innerRadius,
            this.roomRadius,
            this.roomRadius,
            outerRadius
        );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        rctx.fillStyle = gradient;
        rctx.beginPath();
        rctx.arc(this.roomRadius, this.roomRadius, this.roomRadius, 0, Math.PI * 2);
        rctx.fill();
        roomCanvas.refresh();

        // 수평 복도
        const hWidth = this.roomDistance;
        const hHeight = this.corridorWidth;
        const hCanvas = this.textures.createCanvas('h_corridor_gradient', hWidth, hHeight);
        const hctx = hCanvas.getContext();

        const hGrad = hctx.createLinearGradient(0, 0, hWidth, 0);
        hGrad.addColorStop(0, 'rgba(255,255,255,0)');
        hGrad.addColorStop(0.2, 'rgba(255,255,255,1)');
        hGrad.addColorStop(0.8, 'rgba(255,255,255,1)');
        hGrad.addColorStop(1, 'rgba(255,255,255,0)');

        hctx.fillStyle = hGrad;
        hctx.fillRect(0, 0, hWidth, hHeight);
        hCanvas.refresh();

        // 수직 복도
        const vWidth = this.corridorWidth;
        const vHeight = this.roomDistance;
        const vCanvas = this.textures.createCanvas('v_corridor_gradient', vWidth, vHeight);
        const vctx = vCanvas.getContext();

        const vGrad = vctx.createLinearGradient(0, 0, 0, vHeight);
        vGrad.addColorStop(0, 'rgba(255,255,255,0)');
        vGrad.addColorStop(0.2, 'rgba(255,255,255,1)');
        vGrad.addColorStop(0.8, 'rgba(255,255,255,1)');
        vGrad.addColorStop(1, 'rgba(255,255,255,0)');

        vctx.fillStyle = vGrad;
        vctx.fillRect(0, 0, vWidth, vHeight);
        vCanvas.refresh();
    }
}
