// main.js

import Images from './scenes/Images.js';
import License from './scenes/License.js';
import Lobby from './scenes/Lobby.js';
import Research from './scenes/Research.js';
import Record from './scenes/Record.js';
import Class from './scenes/Class.js';
import Location from './scenes/Location.js';
import Field from './scenes/Field.js';
import Combat from './scenes/Combat.js';
import FieldPause from './scenes/FieldPause.js';
import CombatPause from './scenes/CombatPause.js';
import WinLose from './scenes/WinLose.js';

export let class_level = {
    wizard: 1,
    astronomer: 2,
    cryomancer: 3,
    shaman: 4,
    warlock: 5,
    arcanist: 0,
    summoner: 0,
    bishop: 0,
    occultist: 0,
    druid: 0,
    pyromancer: 0,
    sorcerer: 0,
    alchemist: 1,
    scholar: 0,
    witch: 0,
    electromancer: 0,
    arbiter: 0,
    archmage: 1,
    archaeologist: 0,
    magician: 0,
    mage: 0,
    battlemage: 0,
    warlord: 0,
    blackmage: 0
};

if (!window.now_class) {
    window.now_class = '';
}

export const class_name = {
    wizard: "마법사",
    astronomer: "천문학자",
    cryomancer: "빙결사",
    shaman: "주술사",
    warlock: "워록",
    arcanist: "마도학자",
    summoner: "소환사",
    bishop: "비숍",
    occultist: "신비술사",
    druid: "드루이드",
    pyromancer: "화염술사",
    sorcerer: "소서러",
    alchemist: "연금술사",
    scholar: "학자",
    witch: "마녀",
    electromancer: "전하술사",
    arbiter: "조율자",
    archmage: "대마법사",
    archaeologist: "고고학자",
    magician: "마술사",
    mage: "메이지",
    battlemage: "전투마법사",
    warlord: "워로드",
    blackmage: "흑마법사"
};

export function getNowClass() {
    return now_class;
}

export function setNowClass(value) {
    now_class = value;
}

export let class_ = {};

export function updateClassTint(classname, ifPressed) {
    const button = class_[classname];
    const level = class_level[classname] || 0;

    let baseColor;

    if (getNowClass() === classname) {
        baseColor = 0xffffcc; // 연노랑
    } else {
        switch (level) {
            case 0: baseColor = 0x555555; break; // 회색
            case 1: baseColor = 0xffffff; break; // 흰색
            case 2: baseColor = 0xccffcc; break; // 연두
            case 3: baseColor = 0x9999ff; break; // 파랑
            case 4: baseColor = 0xffccff; break; // 분홍
            case 5: baseColor = 0xffff99; break; // 노랑
            default: baseColor = 0xffffff;
        }
    }

    if (ifPressed) {
        baseColor = Phaser.Display.Color.IntegerToColor(baseColor).darken(20).color;
    }

    if (button) {
        button.setTint(baseColor);
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    scene: [
        Images,
        License,
        Lobby,
        Research,
        Record,
        Class,
        Location,
        Field,
        Combat,
        FieldPause,
        CombatPause,
        WinLose
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);
