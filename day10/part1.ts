import * as fs from 'fs/promises'

type Pos = {
    x: number;
    y: number;
}

const findStart = (lines: string[], height: number, width: number): Pos => {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (lines[i].charAt(j) === 'S') {
                return {
                    y: i,
                    x: j,
                }
            }
        }
    }
    return { x: -1, y: -1 };
}

const canConnectBottom = (c: string) => {
    return c === 'S' || c === '|' || c === 'F' || c === '7';
}

const canConnectTop = (c: string) => {
    return c === 'S' || c === '|' || c === 'L' || c === 'J';
}

const canConnectLeft = (c: string) => {
    return c === 'S' || c === '-' || c === '7' || c === 'J';
}

const canConnectRight = (c: string) => {
    return c === 'S' || c === '-' || c === 'F' || c === 'L';
}

const fillDistances = (
    lines: string[],
    height: number,
    width: number,
    distances: (number | null)[][],
    x: number,
    y: number,
    distance: number
) => {
    distances[y][x] = distance;
    const current = lines[y][x];

    // above
    if (y > 0) {
        const above = lines[y - 1][x];
        if (canConnectTop(current) && canConnectBottom(above)) {
            const currentDist = distances[y - 1][x];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x, y - 1, distance + 1);
            }
        }
    }

    // below
    if (y < height - 1) {
        const below = lines[y + 1][x];
        if (canConnectBottom(current) && canConnectTop(below)) {
            const currentDist = distances[y + 1][x];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x, y + 1, distance + 1);
            }
        }
    }

    // left
    if (x > 0) {
        const left = lines[y][x - 1];
        if (canConnectLeft(current) && canConnectRight(left)) {
            const currentDist = distances[y][x - 1];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x - 1, y, distance + 1);
            }
        }
    }

    // right
    if (x < width - 1) {
        const right = lines[y][x + 1];
        if (canConnectRight(current) && canConnectLeft(right)) {
            const currentDist = distances[y][x + 1];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x + 1, y, distance + 1);
            }
        }
    }
}

const run = async () => {
    // const content = await fs.readFile('day10/test-input.txt', { encoding: 'utf8' });
    // const content = await fs.readFile('day10/test-input2.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day10/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    const height = lines.length;
    const width = lines[0].length;

    const { x, y } = findStart(lines, height, width);

    const distances: (number | null)[][] = new Array(height)
        .fill(false)
        .map(() => new Array(width).fill(null));


    fillDistances(lines, height, width, distances, x, y, 0);

    let maxDist = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const n = distances[i][j];
            if (n) {
                maxDist = Math.max(maxDist, n);
            }
        }
    }

    console.log(maxDist);

}

run()