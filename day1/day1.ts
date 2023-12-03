import * as fs from 'fs/promises'

const part1 = async () => {
    const digits = "0123456789";
    const content = await fs.readFile("day1/input.txt", {encoding: 'utf8'});
    let sum = 0;
    for (const line of content.split('\n')) {
        let lastDigit = undefined;
        let firstDigit = undefined;
        for (const char of line) {
            const index = digits.indexOf(char)
            if (index != -1) {
                lastDigit = index;
                if (firstDigit === undefined) {
                    firstDigit = index
                }
            }
        }
        lastDigit = lastDigit ?? 0;
        firstDigit = firstDigit ?? 0;
        const value = firstDigit * 10 + lastDigit;
        sum += value;
    }
    console.log("part1:", sum)
}

part1()

const part2 = async () => {
    const digits = new Map([
        ["0", 0],
        ["1", 1],
        ["2", 2],
        ["3", 3],
        ["4", 4],
        ["5", 5],
        ["6", 6],
        ["7", 7],
        ["8", 8],
        ["9", 9],
        ["one", 1],
        ["two", 2],
        ["three", 3],
        ["four", 4],
        ["five", 5],
        ["six", 6],
        ["seven", 7],
        ["eight", 8],
        ["nine", 9],
    ]);
    const content = await fs.readFile("day1/input.txt", {encoding: 'utf8'});
    // const content = await fs.readFile("day1/test-input2.txt", {encoding: 'utf8'});
    let sum = 0;
    for (const line of content.split('\n')) {
        let lastDigit = undefined;
        let firstDigit = undefined;
        for (let i = 0; i < line.length + 4; i++) {
            const substr = line.substring(i, Math.min(line.length, i + 5));
            let value = undefined;
            for (let key of digits.keys()) {
                if (substr.startsWith(key)) {
                    value = digits.get(key);
                }
            }
            if (value !== undefined) {
                lastDigit = value;
                if (firstDigit === undefined) {
                    firstDigit = value
                }
            }
        }
        lastDigit = lastDigit ?? 0;
        firstDigit = firstDigit ?? 0;
        const value = firstDigit * 10 + lastDigit;
        sum += value;
    }
    console.log("part2:", sum)
}

part2()
