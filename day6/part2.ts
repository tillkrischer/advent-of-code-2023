import * as fs from 'fs/promises'

const run = async () => {
    // const content = await fs.readFile('day6/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day6/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    const time = Number.parseInt(lines[0]
        .split(/\s+/)
        .slice(1)
        .join("")
    )
    const distance = Number.parseInt(lines[1]
        .split(/\s+/)
        .slice(1)
        .join("")
    )

    const t = time;
    const d = distance;
    const root = Math.sqrt(t * t - 4 * d)
    const x1 = (t + root) / 2;
    const x2 = (t - root) / 2;
    const x1rounded = Math.ceil(x1 - 1)
    const x2rounded = Math.floor(x2 + 1)
    const ways = x1rounded - x2rounded + 1
    console.log(ways);
}

run()
