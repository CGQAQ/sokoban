import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';

import { Cell } from './cell';

import { KeyCode, PlayerOrientation } from '../lib/constants';
import {
    useInit,
    useDatacenter,
    useGamedata,
    useKey,
    usePlayerPosition,
    usePoints,
    useMove,
    useRenderdata,
    useTiles
} from '../hooks/index';

export const Board = () => {
    const [dataCenter, total] = useDatacenter();
    const [level, setLevel] = useState(1);
    const [unit, width, height, mapData, setMapData] = useGamedata(
        dataCenter,
        level
    );
    const points = usePoints(mapData);
    const [lastMove, setLastMove] = useState(KeyCode.down);

    useEffect(() => {
        if (points === 0) {
            if (level >= total) {
                alert(
                    'Congrats, You finished all levels, click ok to back to first level!'
                );
                setLevel(1);
            } else {
                alert('Level finished, click ok to go to next level!');
                setLevel(level + 1);
            }
        }
    }, [points]);

    const tiles = useTiles(level);

    const playerPosition = usePlayerPosition(mapData);
    const [gameState, setGameState] = useState();
    const [playerOrientation, setPlayerOrientation] = useState(
        PlayerOrientation.down
    );

    const renderData = useRenderdata(mapData, tiles, playerOrientation);
    useEffect(() => {
        switch (lastMove) {
            case KeyCode.up:
                setPlayerOrientation(PlayerOrientation.up);
                break;
            case KeyCode.down:
                setPlayerOrientation(PlayerOrientation.down);
                break;
            case KeyCode.left:
                setPlayerOrientation(PlayerOrientation.left);
                break;
            case KeyCode.right:
                setPlayerOrientation(PlayerOrientation.right);
                break;
        }
    }, [lastMove]);

    const upKey = useKey(KeyCode.up);
    const downKey = useKey(KeyCode.down);
    const leftKey = useKey(KeyCode.left);
    const rightKey = useKey(KeyCode.right);

    // setMapData
    const keys = useMemo(() => {
        if (upKey > 0) {
            setLastMove(KeyCode.up);
        }
        if (downKey > 0) {
            setLastMove(KeyCode.down);
        }
        if (leftKey > 0) {
            setLastMove(KeyCode.left);
        }
        if (rightKey > 0) {
            setLastMove(KeyCode.right);
        }
        return [upKey, downKey, leftKey, rightKey];
    }, [upKey, downKey, leftKey, rightKey]);

    useMove(keys, mapData, setMapData, playerPosition); // move the charactor

    // eslint-disable-next-line no-console
    // console.log(upKey, downKey, leftKey, rightKey);
    // console.log(renderData, mapData);

    if (!renderData) return <div />;

    return renderData.map((r, i) => (
        <div className="row" key={i}>
            {r.map((v, i) => {
                return <Cell key={i} size={unit} data={v} />;
            })}
        </div>
    ));
};
