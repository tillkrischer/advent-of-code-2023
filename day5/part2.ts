import * as fs from 'fs/promises'

type Range = {
    start: number,
    len: number,
    delta: number
}

const normalize = (map: Range[]) => {
    const max = 5_000_000_000;
    let pos = 0;
    let mapPos = 0;
    while (mapPos < map.length) {
        const nextSegmentStart = map[mapPos].start
        if (pos < nextSegmentStart) {
            map.splice(mapPos, 0, {start: pos, delta: 0, len: nextSegmentStart - pos})
        }
        pos = map[mapPos].start + map[mapPos].len;
        mapPos += 1;
    }
    let end = 0
    if (map.length > 0) {
        end = (map[map.length - 1].start + map[map.length - 1].len)
    }
    if (end < max) {
        map.push({start: end, delta: 0, len: max - end})
    }
};

const readMap = (lines: string[], i: number) => {
    const map: Range[] = [];
    while (i < lines.length && lines[i] !== '') {
        const split = lines[i].split(' ');
        map.push({
            start: Number.parseInt(split[1]),
            len: Number.parseInt(split[2]),
            delta: Number.parseInt(split[0]) - Number.parseInt(split[1]),
        })

        i += 1;
    }
    const sorted = map.sort((a, b) => a.start - b.start);
    return {i, map: sorted};
}

const applyMapping = (i: number, map: Range[]) => {
    for (const range of map) {
        if (i < range.start) {
            return i;
        } else if (i < range.start + range.len) {
            return i + range.delta;
        }
    }
    return i;
}

const applyAllMappings = (i: number, mappings: Range[][]) => {
    for (const map of mappings) {
        i = applyMapping(i, map);
    }
    return i;
}

const mergeMaps = (a: Range[], b: Range[]) => {
    let aPos = 0;
    let bPos = 0;
    let i = 0;
    let delta = 0;
    const mergedMap: Range[] = [];
    while (aPos < a.length || bPos < b.length) {
        if (aPos < a.length && i === a[aPos].start + a[aPos].len) {
            delta -= a[aPos].delta;
            aPos += 1;
        }
        if (bPos < b.length && i === b[bPos].start + b[bPos].len) {
            delta -= b[bPos].delta;
            bPos += 1;
        }
        if (aPos < a.length && i === a[aPos].start) {
            delta += a[aPos].delta
        }
        if (bPos < b.length && i === b[bPos].start) {
            delta += b[bPos].delta
        }
        let nextA = Number.MAX_VALUE;
        if (aPos < a.length) {
            nextA = a[aPos].start > i ? a[aPos].start : a[aPos].start + a[aPos].len;
        }
        let nextB = Number.MAX_VALUE;
        if (bPos < b.length) {
            nextB = b[bPos].start > i ? b[bPos].start : b[bPos].start + b[bPos].len;
        }
        let next = Math.min(nextA, nextB);
        if (delta !== 0) {
            mergedMap.push({
                start: i,
                len: next - i,
                delta: delta,
            })
        }

        i = next;
    }
    return mergedMap;
}

const mergeMaps2 = (a: Range[], b: Range[]) => {
    normalize(a);
    normalize(b);
    let merged: Range[] = []
    for (const range of a) {
        const s = getSlice(b, range.start + range.delta, range.len);
        for (const rangeInSlice of s) {
            rangeInSlice.start -= range.delta;
            rangeInSlice.delta += range.delta;
        }
        merged = merged.concat(s);
    }
    const sorted = merged.sort((a, b) => a.start - b.start);
    return sorted;
}

const getSlice = (map: Range[], start: number, len: number): Range[] => {
    let i = 0;
    const result: Range[] = []
    while ((map[i].start + map[i].len) <= start) {
        i += 1;
    }
    result.push({
        start: start,
        len: Math.min((map[i].start + map[i].len) - start, len),
        delta: map[i].delta,
    })
    i += 1;
    while (i < map.length && map[i].start + map[i].len <= start + len) {
        result.push(map[i]);
        i += 1;
    }
    if (i < map.length && map[i].start < start + len) {
        result.push({
            start: map[i].start,
            len: start + len - map[i].start,
            delta: map[i].delta,
        })
    }
    return result;
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
    const limit = 100;
    let b = 0;
    const maps = []
    while (i < lines.length && b < limit) {
        const {map, i: newI} = readMap(lines, i);
        maps.push(map);
        i = newI + 2;
        b += 1;
    }

    i = 3;
    b = 0;
    let mergedMap: Range[] = []
    while (i < lines.length && b < limit) {
        const {map, i: newI} = readMap(lines, i);
        mergedMap = mergeMaps2(mergedMap, map)
        i = newI + 2;
        b += 1;
    }

    // for (let j = 0; j < 101; j++) {
    //     const looped = applyAllMappings(j, maps);
    //     const merged = applyMapping(j, mergedMap);
    //     console.log(j, "looped", looped, "merged", merged);
    // }
    // for (let j = 0; j < 101; j++) {
    //     const looped = applyAllMappings(j, maps);
    //     console.log(looped);
    // }

    // console.log(maps[0])
    // const s =  getSlice(maps[0], 45, 60);
    // console.log(s)

    // const merged = mergeMaps2(maps[0], maps[1])
    // console.log(merged);

    console.log(mergedMap)

    let minDest = Number.MAX_VALUE;
    for (let i = 0; i < seeds.length; i += 2) {
        const start = seeds[i];
        const length = seeds[i + 1];
        const slice = getSlice(mergedMap, start, length)
        for (const s of slice) {
            const min = s.start + s.delta;
            minDest = Math.min(minDest, min);
        }

    }
    console.log(minDest);
}

run()
