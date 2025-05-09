export default class Lobby extends Phaser.Scene {
    constructor() {
        super('Lobby');
    }

    create() {
        const image = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'main').setAlpha(0);

        // 이미지 원본 크기
        const iw = this.textures.get('main').getSourceImage().width;
        const ih = this.textures.get('main').getSourceImage().height;

        // 화면 비율 기준으로 축소 비율 계산
        const scaleX = window.innerWidth / iw;
        const scaleY = window.innerHeight / ih;
        const scale = Math.min(scaleX, scaleY);
        image.setScale(scale);

        // 페이드인 트윈
        this.tweens.add({
            targets: image,
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
        });
    }
}