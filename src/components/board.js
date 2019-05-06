import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';

import getMapData from '../lvl/index';

import { Cell } from './cell';

import { genTiles, dataToTile, ObjType } from './resourses';

function useInit({ setGameData, setLevel }) {
	useEffect(() => {
		setLevel(1);
		// eslint-disable-next-line
	}, []);
}

const PlayerOrientation = {
	up: 'UP',
	down: 'DOWN',
	left: 'LEFT',
	right: 'RIGHT',
};

const MoveDirection = PlayerOrientation;

const KeyCode = {
	up: 'ArrowUp',
	down: 'ArrowDown',
	left: 'ArrowLeft',
	right: 'ArrowRight',
};

function useKey(concernedKey, gap) {
	const [counter, setCounter] = useState(0);

	let inter = null;

	if (!gap) gap = 300;

	const keydownHandler = function(ev) {
		// console.log(inter, ev.code, concernedKey);

		if (!inter && ev.code === concernedKey) {
			if (!inter) {
				setCounter(c => c + 1);
			}
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
		window.addEventListener('keydown', keydownHandler);
		window.addEventListener('keyup', keyupHandler);

		return () => {
			window.removeEventListener('keydown', keydownHandler);
			window.removeEventListener('keydown', keyupHandler);
		};
	}, []);

	return counter;
}

function findIndexofMapData(data, target) {
	if (!data) return [-1, -1];
	return data.reduce(
		(a, b, i) => {
			const result = b.findIndex(v => {
				// v === target
				if (v === 5) console.log('w');
				if (target instanceof Array) {
					for (let item in target) {
						if (item === v) {
							console.log('0.0');
							return true;
						}
					}
					return false;
				} else {
					if (v === target) {
						return true;
					}
					return false;
				}
			});
			if (result !== -1) {
				return [i, result];
			}
			if (a[0] !== -1 && a[1] !== -1) {
				return a;
			}
			return [-1, -1];
		},
		[-1, -1],
	);
}

// function exchange(a, b, getter) {
// 	const data = _.cloneDeep(getter);
// 	[data[a[0]][a[1]], data[b[0]][b[1]]] = [data[b[0]][b[1]], data[a[0]][a[1]]];
// 	return data;
// }

function move(moveDirection, playerPosition, mapData, setMapData) {
	let a, b;
	let [x, y] = playerPosition;
	switch (moveDirection) {
		case MoveDirection.up:
			a = -1;
			b = 0;
			break;
		case MoveDirection.down:
			a = 1;
			b = 0;
			break;
		case MoveDirection.left:
			a = 0;
			b = -1;
			break;
		case MoveDirection.right:
			a = 0;
			b = 1;
			break;
		default:
			break;
	}

	let [nx, ny] = [x + a, y + b];

	let dest = -1;
	if (
		nx >= mapData.length ||
		nx < 0 ||
		(ny >= mapData[nx].length || ny < 0)
	) {
		console.log(nx, mapData.length, ny, mapData.length);
		dest = -1;
	} else {
		dest = mapData[nx][ny];
	}

	if (dest !== ObjType.block) {
		// it's possible to be ground, point(add together) and box

		console.log('???', dest);
		if (dest === -1) return;

		if (dest === ObjType.ground) {
			console.log('you are right');
			const newData = _.cloneDeep(mapData);
			newData[nx][ny] = ObjType.player;
			if (mapData[x][y] === ObjType.point + ObjType.player) {
				newData[x][y] = ObjType.point;
			} else {
				newData[x][y] = ObjType.ground;
			}
			// setMapData(exchange([x, y], [nx, ny], mapData));
			setMapData(newData);
		} else if (
			dest === ObjType.box ||
			dest === ObjType.box + ObjType.point
		) {
			// see if box can be push
			const [nnx, nny] = [nx + a, ny + b];
			if (mapData[nnx][nny] === ObjType.ground) {
				// ground in front of the box, which can be pushed

				const newData = _.cloneDeep(mapData);
				newData[nnx][nny] = ObjType.box;

				if (mapData[x][y] === ObjType.point + ObjType.player) {
					if (dest === ObjType.box + ObjType.point) {
						newData[nx][ny] = ObjType.player + ObjType.point;
					} else {
						newData[nx][ny] = ObjType.player;
					}
					newData[x][y] = ObjType.point;
				} else {
					// setMapData(
					// 	exchange(
					// 		[x, y],
					// 		[nx, ny],
					// 		exchange([nnx, nny], [nx, ny], mapData),
					// 	),
					// );
					newData[x][y] = ObjType.ground;
					if (dest === ObjType.box + ObjType.point) {
						newData[nx][ny] = ObjType.player + ObjType.point;
					} else {
						newData[nx][ny] = ObjType.player;
					}
				}
				setMapData(newData);
			} else if (mapData[nnx][nny] === ObjType.point) {
				const newData = _.cloneDeep(mapData);
				newData[nnx][nny] = ObjType.box + ObjType.point;
				newData[nx][ny] = ObjType.player;
				if (newData[x][y] === ObjType.point + ObjType.player) {
					newData[x][y] = ObjType.point;
				} else {
					newData[x][y] = ObjType.ground;
				}
				setMapData(newData);
			}
		} else if (dest === ObjType.point) {
			// will step on the point after move
			const newData = _.cloneDeep(mapData);
			newData[nx][ny] = ObjType.point + ObjType.player;
			if (mapData[x][y] === ObjType.point + ObjType.player) {
				newData[x][y] = ObjType.point;
			} else {
				newData[x][y] = ObjType.ground;
			}
			setMapData(newData);
		}
		// else if (dest === ) {
		// 	const newData = _.cloneDeep(mapData);
		// 	newData[nx][ny] = ObjType.point + ObjType.player;
		// 	if (mapData[x][y] === ObjType.point + ObjType.player) {
		// 		newData[x][y] = ObjType.point;
		// 	} else {
		// 		newData[x][y] = ObjType.ground;
		// 	}
		// 	setMapData(newData);
		// }
	}
}

function useMove(keys, mapData, setMapData, playerPosition) {
	useEffect(() => {
		if (!mapData) return;

		const [upKey, downKey, leftKey, rightKey] = keys;

		if (upKey > 0) {
			move(MoveDirection.up, playerPosition, mapData, setMapData);
		}
		if (downKey > 0) {
			move(MoveDirection.down, playerPosition, mapData, setMapData);
		}
		if (leftKey > 0) {
			move(MoveDirection.left, playerPosition, mapData, setMapData);
		}
		if (rightKey > 0) {
			move(MoveDirection.right, playerPosition, mapData, setMapData);
		}
	}, [keys]);
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
		setPlayerPosition(
			findIndexofMapData(mapData, [
				ObjType.player,
				ObjType.player + ObjType.point,
			]),
		);
	}, [mapData]);
	return playerPosition;
}

export const Board = () => {
	const dataCenter = useDatacenter();
	const [level, setLevel] = useState(1);
	const [unit, width, height, mapData, setMapData] = useGamedata(
		dataCenter,
		level,
	);
	const tiles = useTiles(level);
	const renderData = useRenderdata(mapData, tiles);

	const playerPosition = usePlayerPosition(mapData);
	const [gameState, setGameState] = useState();
	const [playerOrientation, setPlayerOrientation] = useState(
		PlayerOrientation.down,
	);

	const upKey = useKey(KeyCode.up);
	const downKey = useKey(KeyCode.down);
	const leftKey = useKey(KeyCode.left);
	const rightKey = useKey(KeyCode.right);

	// setMapData
	const keys = useMemo(() => [upKey, downKey, leftKey, rightKey], [
		upKey,
		downKey,
		leftKey,
		rightKey,
	]);

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
