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

        // 카메라
        this.cameras.main.startFollow(this.player, true, 0.35, 0.35);
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // RenderTexture 생성 (검정 배경 + 구멍 뚫기)
        this.obstacleMask = this.make.renderTexture({
            width: worldSize,
            height: worldSize,
            add: true
        });
        this.obstacleMask.setOrigin(0.5);
        this.obstacleMask.setPosition(0, 0);
        this.obstacleMask.setDepth(10);
        this.obstacleMask.setBlendMode(Phaser.BlendModes.MULTIPLY);

        // 처음 검은색으로 덮기
        this.obstacleMask.fill(0x000000, 1);

        // 텍스처 준비
        this.circleGradient = this.make.graphics({ x: 0, y: 0, add: false });
        const r = 400;
        const grad = this.circleGradient.createRadialGradient(r, r, r * 0.6, r, r, r);
        grad.addColorStop(0, 'white');
        grad.addColorStop(1, 'transparent');
        this.circleGradient.fillStyle(grad);
        this.circleGradient.fillCircle(r, r, r);
        this.circleGradient.generateTexture('circleGradient', r * 2, r * 2);

        // 직선 통로 텍스처
        this.rectGradient = this.make.graphics({ x: 0, y: 0, add: false });
        const corridorLength = 2400;
        const corridorThickness = 240;
        const corridorGrad = this.rectGradient.createLinearGradient(0, 0, corridorThickness, 0);
        corridorGrad.addColorStop(0, 'transparent');
        corridorGrad.addColorStop(0.5, 'white');
        corridorGrad.addColorStop(1, 'transparent');
        this.rectGradient.fillStyle(corridorGrad);
        this.rectGradient.fillRect(0, 0, corridorLength, corridorThickness);
        this.rectGradient.generateTexture('rectGradient', corridorLength, corridorThickness);

        // 키 입력
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

        this.drawVisibleAreas();
    }

    drawVisibleAreas() {
        const px = this.player.x;
        const py = this.player.y;

        // 전체 다시 검은색으로 덮기
        this.obstacleMask.clear();
        this.obstacleMask.fill(0x000000, 1);

        const gridSize = 2400;
        const radius = 400;
        const corridorThickness = 240;

        const cx = Math.round(px / gridSize);
        const cy = Math.round(py / gridSize);

        const range = 2; // 얼마나 많은 방을 표시할지

        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const roomX = (cx + dx) * gridSize;
                const roomY = (cy + dy) * gridSize;

                // 방
                this.obstacleMask.draw('circleGradient', roomX - radius, roomY - radius);

                // 가로 복도
                this.obstacleMask.draw('rectGradient', roomX - gridSize / 2, roomY - corridorThickness / 2);

                // 세로 복도 (90도 회전)
                this.obstacleMask.draw('rectGradient', roomX - corridorThickness / 2, roomY - gridSize / 2, 1, 1, 90);
            }
        }
    }
}
