import * as fs from 'fs/promises'
import { start } from 'repl';

type Node = {
    left: string;
    right: string;
}

const getSteps = (sequence: string, nodes: Map<string, Node>, start: string) => {
    let pos = start;
    let step = 0;

    while (pos.charAt(2) !== 'Z') {
        const direction = sequence.charAt(step % sequence.length);
        if (direction === 'L') {
            pos = nodes.get(pos).left;
        } else {
            pos = nodes.get(pos).right;
        }
        step += 1;
    }
    return step;
}

const gcd = (a: number, b: number) => {
    if (a === b) {
        return a;
    }
    const larger = a > b ? a : b;
    const smaller = a > b ? b : a;
    return gcd(larger - smaller, smaller)
}

const lcm = (a: number, b: number) => {
    const num = Math.abs(a * b);
    const denom = gcd(a, b);
    return num / denom;
}

const run = async () => {
    // const content = await fs.readFile('day8/test-input.txt', { encoding: 'utf8' });
    // const content = await fs.readFile('day8/test-input2.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day8/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    const sequence = lines[0]

    const nodes = new Map<string, Node>();
    for (let i = 2; i < lines.length; i++) {
        const match = lines[i].match(/([A-Z0-9]{3})\s=\s\(([A-Z0-9]{3}), ([A-Z0-9]{3})\)/);
        nodes.set(match[1], { left: match[2], right: match[3] })
    }

    const starts = [...nodes.keys()]
        .filter(n => n.charAt(2) === 'A');
    const steps = starts.map(start => getSteps(sequence, nodes, start))
    const total = steps.reduce((a, b) => lcm(a, b), 1);
    console.log(total);
}

run()
