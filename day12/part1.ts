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

const readRecord = (record: string[], groups: number[], pos: number, currentGroup: number) => {
    // console.log("record", record, "pos", pos, "groups", groups)
    let newGroups = [...groups];
    let newCurrentGroup = currentGroup;

    if (pos < record.length && record[pos] === '?') {
        const newRecord = [...record];
        newRecord[pos] = '.';
        let count = readRecord(newRecord, newGroups, pos, newCurrentGroup);
        if (canPlace(record, newGroups, pos, newCurrentGroup)) {
            newRecord[pos] = '#';
            count += readRecord(newRecord, newGroups, pos, newCurrentGroup);
        }
        return count;
    }

    if (pos >= record.length || record[pos] === '.') {
        if (newCurrentGroup > 0) {
            if ((newGroups.length === 0 || newGroups[0] !== newCurrentGroup)) {
                // console.log("a: invalid", pos);
                return 0;
            }
            newGroups.shift();
            newCurrentGroup = 0;
        }
    }

    if (pos >= record.length) {
        if (newGroups.length !== 0) {
            // console.log("b: invalid", pos);
            return 0;
        } else {
            // console.log("valid");
            // console.log(record)
            return 1;
        }
    }

    if (record[pos] === '#') {
        newCurrentGroup += 1;
    }

    return readRecord(record, newGroups, pos + 1, newCurrentGroup);
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

        const count = readRecord(record, groups, 0, 0);
        // console.log("record", record);
        // console.log(count);
        sum += count;
    }
    console.log("sum", sum);
}


run()

// let result = false;
// result = canPlace([ "?", "?", "?", ".", "#", "#", "#" ], [1, 1, 3], 0, 0);
// console.log(result);
// result = canPlace([ "?", "#", "?", "#", "?", "#", "?", "#", "?", "#", "?", "#", "?", "#", "?" ] , [1, 3, 1, 6], 0, 0);
// console.log(result);

// readRecord(["?", "?", "?", ".", "#", "#", "#"], [1, 1, 3], 0, 0);
// const result = readRecord([".", "?", "?", ".", ".", "?", "?", ".", ".", ".", "?", "#", "#", "."], [1, 1, 3], 0, 0);
// console.log(result);

