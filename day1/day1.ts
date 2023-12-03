import * as fs from 'fs/promises'

const run = async () => {
    const digits = "0123456789";
    const content = await fs.readFile("day1/input.txt", {encoding: 'utf8'});
    let sum = 0;
    for (const line of content.split('\n')) {
        let lastChar = undefined;
        let firstChar = undefined;
        for (const char of line) {
            const index = digits.indexOf(char)
            if (index != -1) {
                lastChar = index;
                if (firstChar === undefined) {
                    firstChar = index
                }
            }
        }
        lastChar = lastChar ?? 0;
        firstChar = firstChar ?? 0;
        const value = firstChar * 10 + lastChar;
        sum += value;
    }
    console.log(sum)
}

run()