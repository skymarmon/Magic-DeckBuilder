export default class Field extends Phaser.Scene {
    constructor() {
        super('Field');
    }

    init(data) {
        this.fromLocation = data.fromLocation || false;
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        this.cameras.main.setBackgroundColor('#dddddd');

        if (this.fromLocation) {
            this.cameras.main.fadeIn(1000, 0, 0, 0);
        }

        const worldSize = 10000;
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

        // 카메라
        this.cameras.main.startFollow(this.player, true, 0.35, 0.35);
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // 그림자/장애물 스프라이트 설정
        const shadowTexture = this.textures.get('field_shadow').getSourceImage();
        const shadowBaseScale = 0.5;
        this.shadowScale = Math.min((width) / (shadowTexture.width * shadowBaseScale), 1) * shadowBaseScale;

        this.shadowGroup = [];
        this.obstacleGroup = [];

        for (let i = 0; i < 4; i++) {
            // 시각적 그림자 (물리 없음)
            const shadow = this.add.image(0, 0, 'field_shadow')
                .setOrigin(0.5)
                .setScale(this.shadowScale);
            this.shadowGroup.push(shadow);

            // 충돌용 장애물 (물리 있음)
            const obstacle = this.physics.add.staticImage(0, 0, 'field_shadow_obstacle')
                .setOrigin(0.5)
                .setScale(this.shadowScale);
            this.obstacleGroup.push(obstacle);
        }

        // 충돌 설정
        this.obstacleGroup.forEach(obstacle => {
            this.physics.add.collider(this.player, obstacle);
        });

        // 입력
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
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

        // 플레이어 근처 4개의 (n, m) 계산
        const px = this.player.x;
        const py = this.player.y;
        const gridSize = 2600;

        const nearestN = Math.round((px + 1300) / gridSize);
        const nearestM = Math.round((py + 1300) / gridSize);

        const candidates = [];
        for (let dn = -1; dn <= 1; dn++) {
            for (let dm = -1; dm <= 1; dm++) {
                const n = nearestN + dn;
                const m = nearestM + dm;
                const x = gridSize * n - 1300;
                const y = gridSize * m - 1300;
                const distSq = (x - px) ** 2 + (y - py) ** 2;
                candidates.push({ x, y, distSq });
            }
        }

        candidates.sort((a, b) => a.distSq - b.distSq);
        const nearest4 = candidates.slice(0, 4);

        for (let i = 0; i < 4; i++) {
            const { x, y } = nearest4[i];
            this.shadowGroup[i].setPosition(x, y);
            this.obstacleGroup[i].setPosition(x, y);
        }
    }
}
