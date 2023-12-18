
import * as fs from 'fs/promises'

type Entry = {
    hand: string;
    bid: number;
}

const cardValues: Map<string, number> = new Map([
    ["A", 14],
    ["K", 13],
    ["Q", 12],
    ["J", 1],
    ["T", 10],
    ["9", 9],
    ["8", 8],
    ["7", 7],
    ["6", 6],
    ["5", 5],
    ["4", 4],
    ["3", 3],
    ["2", 2],
])


const getCardCounts = (hand: string) => {
    const map = new Map<string, number>()
    for (let i = 0; i < 5; i++) {
        const c = hand.charAt(i)
        const current = map.get(c) ?? 0;
        map.set(c, current + 1);
    }
    return map;
}

const tieBreak = (a: string, b: string) => {
    for (let i = 0; i < 5; i++) {
        const ca = a.charAt(i);
        const cb = b.charAt(i);
        const valA = cardValues.get(ca) ?? 0;
        const valB = cardValues.get(cb) ?? 0;
        if (valA < valB) {
            return 1;
        } else if (valA > valB) {
            return -1;
        }
    }
    return 0;
}

const getType = (hand: string) => {
    const counts = getCardCounts(hand);
    const values = [...counts.values()]
    values.sort((a, b) => b - a)
    if (values[0] === 5) {
        return 7;
    } else if (values[0] === 4) {
        return 6;
    } else if (values[0] === 3 && values[1] === 2) {
        return 5;
    } else if (values[0] === 3) {
        return 4;
    } else if (values[0] === 2 && values[1] === 2) {
        return 3;
    } else if (values[0] === 2) {
        return 2;
    } else {
        return 1;
    }
}

const compareHands = (a: string, b: string) => {
    const processedA = processJokers(a);
    const processedB = processJokers(b);
    const typeA = getType(processedA);
    const typeB = getType(processedB);
    const diff = typeB - typeA;
    if (diff !== 0) {
        return diff;
    }
    const br = tieBreak(a, b);
    return br;
}

const processJokers = (hand: string) => {
    const counts = getCardCounts(hand);
    let maxCount = 0;
    let maxChar = 'K';
    for (const [char, count] of counts.entries()) {
        if (char !== 'J' && count > maxCount) {
            maxChar = char;
            maxCount = count;
        }
    }
    return hand.replaceAll('J', maxChar);
}

const run = async () => {
    // const content = await fs.readFile('day7/test-input.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day7/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');
    const entries: Entry[] = []

    for (const line of lines) {
        const split = line.split(/\s+/)
        const hand = split[0]
        const bid = Number.parseInt(split[1])
        entries.push({ hand, bid })
    }

    entries.sort((a, b) => compareHands(b.hand, a.hand));

    let sum = 0;
    for (let i = 1; i <= entries.length; i++) {
        sum += i * entries[i-1].bid;
    }
    console.log(sum)
}

run()



let result  = processJokers("JT92A")
console.log(result)
 result  = processJokers("9QJJ6")
console.log(result)