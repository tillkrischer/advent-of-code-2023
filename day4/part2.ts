import * as fs from 'fs/promises'

const getWinners = (line: string): number => {
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
    let matches = 0;
    for (const n of drawnNumbers) {
        if (winners.has(n)) {
            matches += 1;
        }
    }
    return matches;
}

const getExtraCards = (idToWinnerCount: Map<number, number>, cards: Map<number, number>) => {
    const extraCards = new Map<number, number>();
    for (const [id, count] of cards) {
        const winnersCount = idToWinnerCount.get(id);
        for (let i = id + 1; i <= id + winnersCount; i++) {
            const current = extraCards.get(i) ?? 0;
            extraCards.set(i, current + count);
        }
    }
    return extraCards;
}

const run = async () => {
    // const content = await fs.readFile('day4/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day4/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');
    const idToWinnerCount = new Map<number, number>();
    let cards = new Map<number, number>();
    for (const line of lines) {
        const id = Number.parseInt(line.match(/^Card\s+(\d+)/)[1])
        const winnerCount = getWinners(line);
        idToWinnerCount.set(id, winnerCount);
        cards.set(id, 1);
    }
    let cardCount = 0;

    while (cards.size > 0) {
        for (const count of cards.values()) {
            cardCount += count;
        }
        cards = getExtraCards(idToWinnerCount, cards);
    }
    console.log(cardCount);
}

run()
