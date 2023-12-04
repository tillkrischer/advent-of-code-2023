import * as fs from 'fs/promises'

type PartNumber = {
    line: number,
    pos: number,
    count: number
}

const getPartNumbers = (lines: string[]): PartNumber[] => {
    const partNumbers = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let length = 0;
        let start = 0;
        for (let j = 0; j < line.length; j++) {
            const isDigit = /\d/.test(line.charAt(j));
            if (isDigit) {
                if (length == 0) {
                    start = j;
                }
                length += 1;
            }
            if (!isDigit || j == line.length - 1) {
                if (length > 0) {
                    partNumbers.push({
                        line: i,
                        pos: start,
                        count: length,
                    });
                }
                length = 0;
            }
        }
    }
    return partNumbers;
}

const isAdjacentToSymbol = (lines: string[], partNumber: PartNumber) => {
    const startRow = Math.max(partNumber.line - 1, 0)
    const endRow = Math.min(partNumber.line + 1, lines.length - 1)
    const startPos = Math.max(partNumber.pos - 1, 0)
    const endPos = Math.min(partNumber.pos + partNumber.count, lines[0].length - 1)
    for (let i = startRow; i <= endRow; i++) {
        for (let j = startPos; j <= endPos; j++) {
            if (!/[\d.]/.test(lines[i].charAt(j))) {
                return true;
            }
        }
    }
    return false;
}

const getValue = (lines: string[], partNumber: PartNumber) => {
    const subs = lines[partNumber.line].substring(partNumber.pos, partNumber.pos + partNumber.count)
    return Number.parseInt(subs)
}

const run = async () => {
    // const content = await fs.readFile("day3/test-input.txt", {encoding: 'utf8'});
    const content = await fs.readFile("day3/input.txt", {encoding: 'utf8'});
    const lines = content.split('\n');
    const partNumbers = getPartNumbers(lines);
    let sum = 0;
    for (const partNumber of partNumbers) {
        if (isAdjacentToSymbol(lines, partNumber)) {
            const value = getValue(lines, partNumber)
            sum += value
        }
    }
    console.log(sum)
}

run();