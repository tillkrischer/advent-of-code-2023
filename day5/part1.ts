import * as fs from 'fs/promises'

type Range = {
    start: number,
    len: number,
    delta: number
}

const readMap = (lines: string[], i: number) => {
    const map: Range[] = [];
    while (i < lines.length && lines[i] !== '') {
        const split = lines[i].split(' ');
        map.push({
            start:  Number.parseInt(split[1]),
            len: Number.parseInt(split[2]),
            delta: Number.parseInt(split[0]) - Number.parseInt(split[1]),
        })

        i += 1;
    }
    const sorted = map.sort((a, b) => a.start - b.start);
    return {i, map: sorted};
}

const applyMapping = (i: number, map: Range[]) => {
    for (const range of map)  {
        if (i < range.start) {
            return i;
        } else if (i < range.start + range.len) {
            return i + range.delta;
        }
    }
    return i;
}

const run = async () => {
    // const content = await fs.readFile('day5/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day5/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');
    const seeds = lines[0]
        .split(/\s+/)
        .slice(1)
        .map(s => Number.parseInt(s))
    let i = 3;
    const maps = []
    while (i < lines.length) {
        const {map, i: newI} = readMap(lines, i);
        maps.push(map);
        i = newI + 2;
    }

    let minDest = Number.MAX_VALUE;
    for (const seed of seeds) {
        let dest = seed;
        for (const map of maps) {
            dest = applyMapping(dest, map)
        }
        minDest = Math.min(minDest, dest);
    }
    console.log(minDest);
}

run()
