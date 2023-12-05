import * as fs from 'fs/promises'

const run = async () => {
    // const content = await fs.readFile('day4/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day4/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');
    let sum = 0;
    for (const line of lines) {
        const split = line.split(/[:|]/)
        const winners = new Set(split[1]
            .trim()
            .split(/\s+/)
            .map(s => Number.parseInt(s))
        )
        const drawnNumbers = split[2]
            .trim()
            .split(/\s+/)
            .map(s => Number.parseInt(s))
        let score = 0;
        for (const n of drawnNumbers) {
            if (winners.has(n)) {
                if (score === 0) {
                    score = 1;
                } else {
                    score *= 2;
                }
            }
        }
        sum += score;
    }
    console.log(sum)
}

run()
