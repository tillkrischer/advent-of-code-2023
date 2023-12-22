import * as fs from 'fs/promises'

const charsDifferent = (a: string, b: string) =>  {
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        if (a.charAt(i) !== b.charAt(i)) {
            diff += 1;
        }
    }
    return diff;
}

const isHorizontalReflection = (pattern: string[][], row: number) => {
    let i = 0;
    let smudge = 0;
    while (row - i - 1 >= 0 && row + i < pattern.length) {
        const top = pattern[row - i - 1].join("");
        const bottom = pattern[row + i].join("");
        smudge += charsDifferent(top, bottom);
        if (smudge >= 2)  {
            return false;
        }
        i += 1;
    }
    return smudge === 1;
}

const isVerticalReflection = (pattern: string[][], column: number) => {
    let i = 0;
    let smudge = 0;
    while (column - i - 1 >= 0 && column + i < pattern[0].length) {
        const left = pattern.map(r => r[column - 1 - i]).join("");
        const right = pattern.map(r => r[column + i]).join("");
        smudge += charsDifferent(left, right);
        if (smudge >= 2)  {
            return false;
        }
        i += 1;
    }
    return smudge === 1;
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
