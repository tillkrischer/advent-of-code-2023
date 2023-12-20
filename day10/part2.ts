import * as fs from 'fs/promises'

type Pos = {
    x: number;
    y: number;
}

const setCharAt = (str: string, index: number, chr: string) => {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
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
    distance: number,
    loop: string[],
) => {
    distances[y][x] = distance;
    const current = lines[y][x];
    loop[y] = setCharAt(loop[y], x, current)

    // above
    if (y > 0) {
        const above = lines[y - 1][x];
        if (canConnectTop(current) && canConnectBottom(above)) {
            const currentDist = distances[y - 1][x];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x, y - 1, distance + 1, loop);
            }
        }
    }

    // below
    if (y < height - 1) {
        const below = lines[y + 1][x];
        if (canConnectBottom(current) && canConnectTop(below)) {
            const currentDist = distances[y + 1][x];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x, y + 1, distance + 1, loop);
            }
        }
    }

    // left
    if (x > 0) {
        const left = lines[y][x - 1];
        if (canConnectLeft(current) && canConnectRight(left)) {
            const currentDist = distances[y][x - 1];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x - 1, y, distance + 1, loop);
            }
        }
    }

    // right
    if (x < width - 1) {
        const right = lines[y][x + 1];
        if (canConnectRight(current) && canConnectLeft(right)) {
            const currentDist = distances[y][x + 1];
            if (currentDist === null || currentDist > distance + 1) {
                fillDistances(lines, height, width, distances, x + 1, y, distance + 1, loop);
            }
        }
    }
}

const processS = (height: number, width: number, x: number, y: number, loop: string[]) => {
    const hasAbove = y > 0 && canConnectBottom(loop[y - 1][x]);
    const hasBelow = y < height - 1 && canConnectTop(loop[y + 1][x]);
    const hasLeft = x > 0 && canConnectRight(loop[y][x - 1]);
    const hasRight = x < width - 1 && canConnectLeft(loop[y][x + 1]);
    let sChar = '.';
    if (hasAbove && hasBelow) {
        sChar = '|'
    }
    if (hasAbove && hasLeft) {
        sChar = 'J'
    }
    if (hasAbove && hasRight) {
        sChar = 'L'
    }
    if (hasBelow && hasLeft) {
        sChar = '7'
    }
    if (hasBelow && hasRight) {
        sChar = 'F'
    }
    if (hasLeft && hasRight) {
        sChar = '-'
    }

    loop[y] = setCharAt(loop[y], x, sChar);
}

const toBigger = new Map<string, string[]>([
    [
        '.',
        [
            '...',
            '...',
            '...',
        ],
    ],
    [
        'F',
        [
            '...',
            '.F-',
            '.|.',
        ],
    ],
    [
        '-',
        [
            '...',
            '---',
            '...',
        ],
    ],
    [
        '7',
        [
            '...',
            '-7.',
            '.|.',
        ],
    ],
    [
        '|',
        [
            '.|.',
            '.|.',
            '.|.',
        ],
    ],
    [
        'J',
        [
            '.|.',
            '-J.',
            '...',
        ],
    ],
    [
        'L',
        [
            '.|.',
            '.L-',
            '...',
        ],
    ],
])

const blowUp = (loop: string[], height: number, width: number, x: number, y: number) => {
    const blownUp: string[][] = new Array(height * 3)
        .fill(false)
        .map(() => new Array(width * 3));

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const bigger = toBigger.get(loop[i].charAt(j))
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    blownUp[i * 3 + k][j * 3 + l] = bigger[k].charAt(l);
                }
            }
        }
    }
    return blownUp;
}

const walkEdge = (blownUp: string[][]) => {
    const height = blownUp.length;
    const width = blownUp[0].length;

    const stack: Pos[] = [];

    for (let i = 0; i < width; i++) {
        //    fillWithZeros(blownUp, 0, i, height, width);
        stack.push({ y: 0, x: i })
    }
    for (let i = 0; i < width; i++) {
        //    fillWithZeros(blownUp, height - 1, i, height, width);
        stack.push({ y: height - 1, x: i })
    }
    for (let i = 0; i < height; i++) {
        //    fillWithZeros(blownUp, i, 0, height, width);
        stack.push({ y: i, x: 0 })
    }
    for (let i = 0; i < height; i++) {
        //    fillWithZeros(blownUp, i, width-1, height, width);
        stack.push({ y: i, x: width - 1 })
    }

    while (stack.length > 0) {
        const { y, x } = stack.pop();
        if (blownUp[y][x] === '.') {
            blownUp[y][x] = '0';
        }
        if (y > 0 && blownUp[y - 1][x] === '.') {
            // fillWithZeros(blownUp, y-1, x, height, width);
            stack.push({ y: y - 1, x: x })
        }
        if (y < height - 1 && blownUp[y + 1][x] === '.') {
            // fillWithZeros(blownUp, y+1, x, height, width);
            stack.push({ y: y + 1, x: x })
        }
        if (x > 0 && blownUp[y][x - 1] === '.') {
            // fillWithZeros(blownUp, y, x-1, height, width);
            stack.push({ y: y, x: x - 1 })
        }
        if (x < width - 1 && blownUp[y][x + 1] === '.') {
            // fillWithZeros(blownUp, y, x+1, height, width);
            stack.push({ y: y, x: x + 1 })
        }
    }
}

const fillWithZeros = (blownUp: string[][], y: number, x: number, height: number, width: number) => {
    if (blownUp[y][x] === '.') {
        blownUp[y][x] = '0';
    }
    if (y > 0 && blownUp[y - 1][x] === '.') {
        fillWithZeros(blownUp, y - 1, x, height, width);
    }
    if (y < height - 1 && blownUp[y + 1][x] === '.') {
        fillWithZeros(blownUp, y + 1, x, height, width);
    }
    if (x > 0 && blownUp[y][x - 1] === '.') {
        fillWithZeros(blownUp, y, x - 1, height, width);
    }
    if (x < width - 1 && blownUp[y][x + 1] === '.') {
        fillWithZeros(blownUp, y, x + 1, height, width);
    }
}

const sampleDown = (blownUp: string[][], height: number, width: number) => {
    const sampledDown: string[][] = new Array(height)
        .fill(false)
        .map(() => new Array(width));
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            sampledDown[i][j] = blownUp[i * 3 + 1][j * 3 + 1]
        }
    }
    return sampledDown;
}

const countDots = (sampledDown: string[][], height: number, width: number) => {
    let count = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (sampledDown[i][j] === '.') {
                count += 1;
            }
        }
    }
    return count;
}

const run = async () => {
    // const content = await fs.readFile('day10/test-input.txt', { encoding: 'utf8' });
    // const content = await fs.readFile('day10/test-input2.txt', { encoding: 'utf8' });
    // const content = await fs.readFile('day10/test-input3.txt', { encoding: 'utf8' });
    // const content = await fs.readFile('day10/test-input4.txt', { encoding: 'utf8' });
    // const content = await fs.readFile('day10/test-input5.txt', { encoding: 'utf8' });
    // const content = await fs.readFile('day10/test-input6.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day10/input.txt', { encoding: 'utf8' });
    const lines = content.split('\n');

    const height = lines.length;
    const width = lines[0].length;

    const { x, y } = findStart(lines, height, width);

    const distances: (number | null)[][] = new Array(height)
        .fill(false)
        .map(() => new Array(width).fill(null));

    const loop: string[] = new Array(height)
        .fill(".".repeat(width));
    fillDistances(lines, height, width, distances, x, y, 0, loop);
    processS(height, width, x, y, loop);
    const blownUp = blowUp(loop, height, width, x, y);
    walkEdge(blownUp);
    const sampledDown = sampleDown(blownUp, height, width);
    const enclosed = countDots(sampledDown, height, width);
    console.log(enclosed);
}

run()