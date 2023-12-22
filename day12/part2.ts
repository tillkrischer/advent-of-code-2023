import * as fs from 'fs/promises'

const canPlace = (record: string[], groups: number[], pos: number, currentGroup) => {
    if (record[pos] === '?') {
        const modRecord = [...record];
        modRecord[pos] = '#';
        let groupEnd = pos;
        while (groupEnd < modRecord.length && modRecord[groupEnd] === '#') {
            groupEnd += 1;
        }
        const groupLength = (groupEnd - pos) + currentGroup;
        return groupLength <= groups[0];

    }
}

const getKey = (record: string[], groups: number[], pos: number, currentGroup: number) => {
    return `record${record.slice(pos).join("")}groups${groups.join(",")}currentGroup${currentGroup}`;
}

const readRecord = (record: string[], groups: number[], pos: number, currentGroup: number, cache: Map<string, number>) => {
    // console.log("record", record, "pos", pos, "groups", groups)

    const key = getKey(record, groups, pos, currentGroup);
    if (cache.has(key)) {
        return cache.get(key);
    }

    if (pos < record.length && record[pos] === '?') {
        const newRecord = [...record];
        newRecord[pos] = '.';
        let count = readRecord(newRecord, groups, pos, currentGroup, cache);
        if (canPlace(record, groups, pos, currentGroup)) {
            newRecord[pos] = '#';
            count += readRecord(newRecord, groups, pos, currentGroup, cache);
        }
        cache.set(key, count);
        return count;
    }

    if (pos >= record.length || record[pos] === '.') {
        if (currentGroup > 0) {
            if ((groups.length === 0 || groups[0] !== currentGroup)) {
                // console.log("a: invalid", pos);
                return 0;
            }
            const newGroups = [...groups];
            newGroups.shift();
            groups = newGroups;
            currentGroup = 0;
        }
    }

    if (pos >= record.length) {
        if (groups.length !== 0) {
            // console.log("b: invalid", pos);
            return 0;
        } else {
            // console.log("valid");
            // console.log(record)
            return 1;
        }
    }

    if (record[pos] === '#') {
        currentGroup += 1;
    }

    const result = readRecord(record, groups, pos + 1, currentGroup, cache);
    cache.set(key, result);
    return result;
}

const run = async () => {
    // const content = await fs.readFile('day12/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day12/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    let sum = 0;
    for (const line of lines) {
        const split = line.split(" ");
        const record = split[0].split("");
        const groups = split[1].split(",").map(s => Number.parseInt(s));

        const repeatedRecord = new Array(5).fill(false).flatMap((_, index) => index === 4 ? record : record.concat("?"));
        const repeatedGroups = new Array(5).fill(false).flatMap(() => groups);

        // console.log("record", record);
        const cache = new Map<string, number>();
        const count = readRecord(repeatedRecord, repeatedGroups, 0, 0, cache);
        // console.log(count);
        sum += count;
    }
    console.log("sum", sum);
}


run()