import React, { useState, useEffect, useMemo } from "react";
import _ from "lodash";

import getMapData from "../lvl/index";

import { Cell } from "./cell";

import { genTiles, dataToTile } from "./resourses";

function useInit({ setGameData, setLevel }) {
    useEffect(() => {
        setLevel(1);
        // eslint-disable-next-line
    }, []);
}

const PlayerOrientation = {
    up: "UP",
    down: "DOWN",
    left: "LEFT",
    right: "RIGHT",
};

const KeyCode = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
};

function useKey(concernedKey, gap) {
    const [counter, setCounter] = useState(0);

    let inter = null;

    if (!gap) gap = 500;

    const keydownHandler = function(ev) {
        // console.log(inter, ev.code, concernedKey);
        if (!inter && ev.code === concernedKey) {
            setCounter(c => c + 1);
            inter = setInterval(() => {
                setCounter(c => c + 1);
            }, gap);
        }
    };
    const keyupHandler = function(ev) {
        if (ev.code === concernedKey) {
            setCounter(0);
            clearInterval(inter);
            inter = null;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", keydownHandler, { capture: true });
        window.addEventListener("keyup", keyupHandler, { capture: true });

        return () => {
            window.removeEventListener("keydown", keydownHandler);
            window.removeEventListener("keydown", keyupHandler);
        };
    });

    return counter;
}

const objType = {
    block: 2, // 2
    box: 3, // 3  .
    point: 4, // 4
    // coin,  // reserved
    ground: 1, // 1
    player: 5, // 5 .
};
function findIndexofMapData(data, target) {
    if (!data) return [-1, -1];
    return data.reduce(
        (a, b, i) => {
            const result = b.findIndex(v => v === target);
            if (result !== -1) {
                return [i, result];
            }
            if (a[0] !== -1 && a[1] !== -1) {
                return a;
            }
            return [-1, -1];
        },
        [-1, -1]
    );
}

function exchange(a, b, getter) {
    const data = _.cloneDeep(getter);
    data[a[0]][a[1]] = objType.ground;
    data[b[0]][b[1]] = objType.player;
    return data;
}

function useMove(keys, mapData, setMapData, playerPosition) {
    useEffect(() => {
        if (!mapData) return;

        const [upKey, downKey, leftKey, rightKey] = keys;
        let [x, y] = playerPosition;
        if (upKey > 0) {
            let [nx, ny] = [x - 1, y];
            console.log(x, y, nx, ny);
            const dest = mapData[nx][ny];
            if (dest !== objType.block) {
                console.log(x, y, nx, ny);
                if (dest === objType.ground) {
                    // setMapData(exchange([x, y], [nx, ny], mapData.data));
                    console.log(x, y, nx, ny);
                }
            }
        }
        if (downKey > 0) {
            let [nx, ny] = [x - 1, y];
        }
        if (leftKey > 0) {
            let [nx, ny] = [x - 1, y];
        }
        if (rightKey > 0) {
            let [nx, ny] = [x - 1, y];
        }
    }, [keys, mapData, setMapData, playerPosition]);
}

function useDatacenter() {
    const [dataCenter, setDataCenter] = useState(null);
    useEffect(() => {
        getMapData().then(data => {
            setDataCenter(data);
        });
        return () => setDataCenter(null);
    }, []);
    return dataCenter;
}

function useGamedata(dataCenter, level) {
    const [unit, setUnit] = useState(null);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [mapData, setMapData] = useState(null);

    useEffect(() => {
        if (!!dataCenter && !!level) {
            setUnit(dataCenter[level - 1].unit);
            setWidth(dataCenter[level - 1].width);
            setHeight(dataCenter[level - 1].height);
            setMapData(dataCenter[level - 1].data);
        }
        return () => {
            setUnit(null);
            setWidth(null);
            setHeight(null);
            setMapData(null);
        };
    }, [dataCenter, level]);

    return [unit, width, height, mapData, setMapData];
}

function useRenderdata(mapData, tiles) {
    const renderData = useMemo(() => {
        if (!!mapData && mapData instanceof Array) {
            if (!tiles) return;
            // setRenderData(

            // );
            return mapData.map(a => {
                return a.map(b => dataToTile(b, tiles));
            });
        }
        return null;
        // return () => setRenderData(null);
    }, [mapData, tiles]);
    return renderData;
}

function useTiles(level) {
    const [tiles, setTiles] = useState();
    useEffect(() => {
        setTiles(genTiles());
    }, [level]);
    return tiles;
}

function usePlayerPosition(mapData) {
    const [playerPosition, setPlayerPosition] = useState([-1, -1]);
    useEffect(() => {
        if (!mapData) return;
        setPlayerPosition(findIndexofMapData(mapData, objType.player));
    }, [mapData, playerPosition]);
    return playerPosition;
}

export const Board = () => {
    const dataCenter = useDatacenter();
    const [level, setLevel] = useState(2);
    const [unit, width, height, mapData, setMapData] = useGamedata(
        dataCenter,
        level
    );
    const tiles = useTiles(level);
    const renderData = useRenderdata(mapData, tiles);

    const playerPosition = usePlayerPosition(mapData);
    const [gameState, setGameState] = useState();
    const [playerOrientation, setPlayerOrientation] = useState(
        PlayerOrientation.down
    );

    const upKey = useKey(KeyCode.up);
    const downKey = useKey(KeyCode.down);
    const leftKey = useKey(KeyCode.left);
    const rightKey = useKey(KeyCode.right);

    // setMapData

    useMove(
        [upKey, downKey, leftKey, rightKey],
        mapData,
        setMapData,
        playerPosition
    ); // move the charactor

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
