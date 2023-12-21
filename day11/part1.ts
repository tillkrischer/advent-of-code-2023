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

const expand = (chars: string[][]) => {
    const emptyRows = getEmptyRows(chars);
    const emptyColumns = getEmptyColumns(chars);
    for (let i = 0; i < emptyRows.length; i++) {
        chars.splice(emptyRows[i] + i, 0, new Array(chars[0].length).fill('.'))
    }
    for (let i = 0; i < emptyColumns.length; i++) {
        const emptyColumn = emptyColumns[i];
        for (let j = 0; j < chars.length; j++) {
            chars[j].splice(emptyColumn + i, 0, '.')
        }
    }
}

const getDistance = (a: Pos, b: Pos) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const run = async () => {
    // const content = await fs.readFile('day11/test-input.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day11/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');
    const chars = lines.map(l => l.split(''));

    expand(chars);

    const galaxies:  Pos[] = []
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
        for (let j = i + 1; j < galaxies.length ; j++) {
            const a = galaxies[i];
            const b = galaxies[j];
            sum += getDistance(a, b);
        }
    }
    console.log(sum)
}

run()
