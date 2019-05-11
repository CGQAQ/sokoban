export const PlayerOrientation = Object.freeze({
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT'
});

export const KeyCode = Object.freeze({
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
});

export const ObjType = Object.freeze({
    void: 0,
    block: 2, // 2
    box: 3, // 3  .
    point: 4, // 4
    // coin,  // reserved
    ground: 1, // 1
    player: 5 // 5 .
});
