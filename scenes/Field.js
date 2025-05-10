export default class Field extends Phaser.Scene {
    constructor() {
        super('Field');
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        // 배경 색상 설정
        this.cameras.main.setBackgroundColor('#dddddd');

        // 무한 맵 개념: 실제로는 넓은 범위 설정
        const worldSize = 10000;
        this.physics.world.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

        // 캐릭터 생성
        this.player = this.physics.add.image(0, 0, 'field_character');
        this.player.setCollideWorldBounds(true);
        this.player.setDamping(true);
        this.player.setDrag(0.95);
        this.player.setMaxVelocity(200);

        // 카메라 설정
        this.cameras.main.startFollow(this.player, true, 0.15, 0.15); // 부드러운 따라가기
        this.cameras.main.setBounds(-worldSize / 2, -worldSize / 2, worldSize, worldSize);

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

        if (this.cursors.left.isDown) {
            vx = -speed;
        } else if (this.cursors.right.isDown) {
            vx = speed;
        }

        if (this.cursors.up.isDown) {
            vy = -speed;
        } else if (this.cursors.down.isDown) {
            vy = speed;
        }

        this.player.setVelocity(vx, vy);
    }
}
