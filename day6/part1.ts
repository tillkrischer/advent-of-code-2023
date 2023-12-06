import * as fs from 'fs/promises'

const run = async () => {
    // const content = await fs.readFile('day6/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day6/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    const times = lines[0]
        .split(/\s+/)
        .slice(1)
        .map(s => Number.parseInt(s));
    const distances = lines[1]
        .split(/\s+/)
        .slice(1)
        .map(s => Number.parseInt(s));

    let product = 1;
    for (let i = 0; i < times.length; i++) {
        const t = times[i];
        const d = distances[i];
        const root = Math.sqrt(t*t-4*d)
        const x1 = (t + root) / 2;
        const x2 = (t - root) / 2;
        const x1rounded = Math.ceil(x1 - 1)
        const x2rounded = Math.floor(x2 + 1)
        const ways = x1rounded - x2rounded + 1
        product *= ways;
    }
    console.log(product);
}

run()
