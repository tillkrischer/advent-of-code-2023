import * as fs from 'fs/promises'

type Node = {
    left: string;
    right: string;
}

const run = async () => {
    // const content = await fs.readFile('day8/test-input.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day8/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    const sequence = lines[0]

    const nodes = new Map<string, Node>();
    for (let i = 2; i < lines.length; i++) {
        const match = lines[i].match( /([A-Z]{3})\s=\s\(([A-Z]{3}), ([A-Z]{3})\)/);
        nodes.set(match[1], {left: match[2], right: match[3]})
    }

    let pos = 'AAA';
    let step = 0;

    while (pos !== 'ZZZ')  {
       const direction = sequence.charAt(step % sequence.length);
       if (direction === 'L') {
        pos = nodes.get(pos).left;
       } else {
        pos = nodes.get(pos).right;
       }
       step += 1;
    }
    console.log(step)
}

run()
