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

        const worldSize = 100000; // 충분히 크게
        this.physics.world.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // 플레이어 설정
        this.player = this.physics.add.image(0, 0, 'field_character');
        this.player.setCollideWorldBounds(true);
        this.player.setDamping(true);
        this.player.setDrag(0.95);
        this.player.setMaxVelocity(200);

        const charOriginalWidth = this.textures.get('field_character').getSourceImage().width;
        const charScale = Math.min((width * 0.035) / charOriginalWidth, 1);
        this.player.setScale(charScale);

        // 카메라 설정
        this.cameras.main.startFollow(this.player, true, 0.35, 0.35);
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // 입력 설정
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // 방과 복도 정보
        this.roomRadius = 400;
        this.roomSpacing = 2400;
        this.corridorThickness = 240;

        // 그래픽 레이어 (마스킹된 영역)
        this.obstacleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        this.maskImage = this.add.image(0, 0, this.textures.createCanvas('maskTexture', width, height));
        this.maskImage.setOrigin(0.5);
        this.maskImage.setDepth(-1);
        this.maskImage.setScrollFactor(0);

        this.maskImage.setPipeline('Light2D');
        this.maskImage.setBlendMode(Phaser.BlendModes.MULTIPLY);
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

        // 마스크 갱신
        this.renderMask();
    }

    renderMask() {
        const ctx = this.textures.get('maskTexture').getSourceImage().getContext('2d');
        const canvas = this.textures.get('maskTexture').getSourceImage();
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        const px = this.player.x;
        const py = this.player.y;

        const cx = width / 2;
        const cy = height / 2;

        const radius = this.roomRadius;
        const spacing = this.roomSpacing;
        const corridor = this.corridorThickness;

        // 근처 9개 방 처리
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const nx = Math.round(px / spacing) + dx;
                const ny = Math.round(py / spacing) + dy;
                const roomX = nx * spacing;
                const roomY = ny * spacing;
                const screenX = cx + (roomX - px);
                const screenY = cy + (roomY - py);

                // 방: 원형, 투명한 그라데이션 경계
                const gradient = ctx.createRadialGradient(screenX, screenY, radius * 0.9, screenX, screenY, radius);
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
                ctx.fill();

                // 복도: 상하 좌우
                const drawCorridor = (x1, y1, x2, y2) => {
                    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
                    grad.addColorStop(0, 'rgba(255,255,255,0)');
                    grad.addColorStop(0.5, 'rgba(255,255,255,1)');
                    grad.addColorStop(1, 'rgba(255,255,255,0)');
                    ctx.fillStyle = grad;
                    if (x1 === x2) {
                        // 수직
                        ctx.fillRect(x1 - corridor / 2, Math.min(y1, y2), corridor, Math.abs(y2 - y1));
                    } else {
                        // 수평
                        ctx.fillRect(Math.min(x1, x2), y1 - corridor / 2, Math.abs(x2 - x1), corridor);
                    }
                };

                // 좌우 복도
                drawCorridor(screenX, screenY, screenX + spacing, screenY);
                drawCorridor(screenX, screenY, screenX - spacing, screenY);

                // 상하 복도
                drawCorridor(screenX, screenY, screenX, screenY + spacing);
                drawCorridor(screenX, screenY, screenX, screenY - spacing);
            }
        }

        this.textures.get('maskTexture').refresh();
    }
}
