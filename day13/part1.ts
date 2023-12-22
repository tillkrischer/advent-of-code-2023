import * as fs from 'fs/promises'

const isHorizontalReflection = (pattern: string[][], row: number) => {
    let i = 0;
    while (row - i - 1 >= 0 && row + i < pattern.length) {
        const top = pattern[row - i - 1].join("");
        const bottom = pattern[row + i].join("");
        if (top !== bottom) {
            return false;
        }
        i += 1;
    }
    return true;
}

const isVerticalReflection = (pattern: string[][], column: number) => {
    let i = 0;
    while (column - i - 1 >= 0 && column + i < pattern[0].length) {
        const left = pattern.map(r => r[column - 1 - i]).join("");
        const right = pattern.map(r => r[column + i]).join("");
        if (left !== right) {
            return false;
        }
        i += 1;
    }
    return true;
}

const findRelection = (pattern: string[][]) => {
    for (let i = 1; i < pattern.length; i++) {
        if(isHorizontalReflection(pattern, i)) {
            return i * 100;
        }
    }
    for (let i = 1; i < pattern[0].length; i++) {
        if(isVerticalReflection(pattern, i)) {
            return i;
        }
    }
}

const run = async () => {
    // const content = await fs.readFile('day13/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day13/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    let i = 0;
    let sum = 0;
    let current: string[][] = [];
    while (i < lines.length) {
        const l = lines[i];
        if (l !== "") {
            current.push(l.split(""));
        }
        if (i === lines.length - 1 || l === "") {
            const n = findRelection(current);
            sum += n;
            current = [];
        }
        i += 1;
    }
    console.log(sum)
}


run()
