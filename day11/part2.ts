import * as fs from 'fs/promises'

type Pos = {
    y: number,
    x: number,
}

const getEmptyRows = (chars: string[][]) => {
    const empty = [];
    for (let i = 0; i < chars.length; i++) {
        const s = chars[i];
        if (s.every(c => c === '.')) {
            empty.push(i);
        }
    }
    return empty;
}

const getEmptyColumns = (chars: string[][]) => {
    const empty = [];
    for (let i = 0; i < chars[0].length; i++) {
        const s = chars.map(l => l[i]);
        if (s.every(c => c === '.')) {
            empty.push(i);
        }
    }
    return empty;
}

const getDistance = (a: Pos, b: Pos, emptyRows: number[], emptyColumns: number[]) => {
    let factor = 1_000_000;

    let [largerY, smallerY] = a.y > b.y ? [a.y, b.y] : [b.y, a.y];
    let [largerX, smallerX] = a.x > b.x ? [a.x, b.x] : [b.x, a.x];

    const emptyRowsBetween = emptyRows
        .filter(r => r > smallerY && r < largerY)
        .length;

    const emptyColumnsBetween = emptyColumns
        .filter(c => c > smallerX && c < largerX)
        .length;

    return largerY - smallerY + emptyRowsBetween * (factor - 1)
        + largerX - smallerX + emptyColumnsBetween * (factor - 1);
}

const run = async () => {
    // const content = await fs.readFile('day11/test-input.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day11/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');
    const chars = lines.map(l => l.split(''));

    const emptyRows = getEmptyRows(chars);
    const emptyColumns = getEmptyColumns(chars);

    const galaxies: Pos[] = []
    for (let i = 0; i < chars.length; i++) {
        for (let j = 0; j < chars[0].length; j++) {
            const c = chars[i][j];
            if (c === '#') {
                galaxies.push({y: i, x: j})
            }
        }
    }

    let sum = 0;
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const a = galaxies[i];
            const b = galaxies[j];
            sum += getDistance(a, b, emptyRows, emptyColumns);
        }
    }
    console.log(sum)
}

run()
