import * as fs from 'fs/promises'

type Range = {
    dest: number,
    source: number,
    len: number
}

const normalize = (map: Range[]) => {
    const max = Math.pow(2, 32);
    let pos = 0;
    let mapPos = 0;
    while (mapPos < map.length) {
        const nextSegmentStart = map[mapPos].source
        if (pos < nextSegmentStart) {
            map.splice(mapPos, 0, {source: pos, dest: pos , len: nextSegmentStart - pos})
        }
        pos = map[mapPos].source + map[mapPos].len;
        mapPos += 1;
    }
    let end = 0
    if (map.length > 0) {
        end = (map[map.length - 1].source + map[map.length - 1].len)
    }
    if (end < max) {
        map.push({source: end, dest: end, len: max - end})
    }
};

const readMap = (lines: string[], i: number) => {
    const map: Range[] = [];
    while (i < lines.length && lines[i] !== '') {
        const split = lines[i].split(' ');
        map.push({
            dest:  Number.parseInt(split[0]),
            source: Number.parseInt(split[1]),
            len: Number.parseInt(split[2]),
        })

        i += 1;
    }
    const sorted = map.sort((a, b) => a.source - b.source);
    normalize(sorted)
    return {i, map: sorted};
}

const getSlice = (a: Range[], start: number, len: number) => {
   let aPos = 0;
   const result: Range[] = [];
   while(aPos < a.length && a[aPos].source + a[aPos].len <= start) {
       aPos += 1;
   }
   while (aPos < a.length && a[aPos].source < start + len ) {
       const rStart = Math.max(a[aPos].source, start);
       const rEnd = Math.min(a[aPos].source + a[aPos].len, start + len)
        result.push({
            source: rStart,
            dest: a[aPos].dest + rStart - a[aPos].source,
            len: rEnd - rStart,
        })
       aPos += 1;
   }
   return result;
}

const mergeMaps = (a: Range[], b: Range[])  => {
    let result: Range[] = [];
    for (const range of a) {
        const s = getSlice(b, range.dest, range.len);
        const shifted = s.map(r => ({
            dest: r.dest,
            len: r.len,
            source: r.source + range.source - range.dest
        }))
        result = result.concat(shifted);
    }
    return result;
}

const isContinous = (a: Range[]) => {
    for (let j = 0; j < a.length - 1 ; j++) {
        const range = a[j];
        const nextRange = a[j+1];
        if (range.source + range.len !== nextRange.source) {
            console.log("not continuous!", j, range, nextRange)
        }
    }
    const last = a[a.length-1];
    if (last.source + last.len != Math.pow(2, 32)) {
        console.log("not to end: ", last.source + last.len);
    }
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
    let mergedMap: Range[] = [{source: 0, dest: 0, len: Math.pow(2, 32)}]
    while (i < lines.length) {
        const {map, i: newI} = readMap(lines, i);
        mergedMap = mergeMaps(mergedMap, map);
        i = newI + 2;
    }

    isContinous(mergedMap);

    let minDest = Number.MAX_VALUE;
    for (let i = 0; i < seeds.length; i += 2) {
        const start = seeds[i];
        const length = seeds[i + 1];
        const slice = getSlice(mergedMap, start, length)
        for (const s of slice) {
            minDest = Math.min(minDest, s.dest);
        }

    }
    console.log(minDest);
}

run()