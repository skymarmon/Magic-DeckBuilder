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

        this.roomRadius = 700;
        this.corridorWidth = 720;
        this.roomDistance = 3200;

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

        let desiredX = this.player.x + vx * this.game.loop.delta / 1000;
        let desiredY = this.player.y + vy * this.game.loop.delta / 1000;

        let dx = vx, dy = vy;
        if (!this.isWalkable(desiredX, this.player.y)) dx = 0;
        if (!this.isWalkable(this.player.x, desiredY)) dy = 0;

        this.player.setVelocity(dx, dy);
        this.updateRenderTexture();
    }

    isWalkable(x, y) {
        const n = Math.round(x / this.roomDistance);
        const m = Math.round(y / this.roomDistance);
        const cx = n * this.roomDistance;
        const cy = m * this.roomDistance;

        const inRoom = Phaser.Math.Distance.Between(x, y, cx, cy) <= this.roomRadius;
        const inHorz = Math.abs(y - cy) <= this.corridorWidth / 2 && Math.abs(x - cx) <= this.roomDistance / 2;
        const inVert = Math.abs(x - cx) <= this.corridorWidth / 2 && Math.abs(y - cy) <= this.roomDistance / 2;

        return inRoom || inHorz || inVert;
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

                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillCircle(cx, cy, this.roomRadius);
                this.rt.draw(this.graphics, -cam.scrollX, -cam.scrollY);

                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(cx - this.roomDistance / 2, cy - this.corridorWidth / 2, this.roomDistance, this.corridorWidth);
                this.rt.draw(this.graphics, -cam.scrollX, -cam.scrollY);

                this.graphics.clear();
                this.graphics.fillStyle(0xffffff, 1);
                this.graphics.fillRect(cx - this.corridorWidth / 2, cy - this.roomDistance / 2, this.corridorWidth, this.roomDistance);
                this.rt.draw(this.graphics, -cam.scrollX, -cam.scrollY);
            }
        }
    }
}
