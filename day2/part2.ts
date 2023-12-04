import * as fs from 'fs/promises'

const run = async () => {
    // const content = await fs.readFile("day2/test-input.txt", {encoding: 'utf8'});
    const content = await fs.readFile("day2/input.txt", {encoding: 'utf8'});
    let sum = 0;
    for (const line of content.split('\n')) {
        const games = line.split(/[:;]/).slice(1)
        let maxRed = 0;
        let maxBlue = 0;
        let maxGreen = 0;
        for (const game of games) {
            const draws = game.split(",");
            for (const draw of draws) {
                const cubes = draw.trim().split(" ");
                const number = Number.parseInt(cubes[0]);
                const color = cubes[1];
                if (color === "red") {
                    maxRed = Math.max(maxRed, number)
                } else if (color === "blue") {
                    maxBlue = Math.max(maxBlue, number)
                } else if (color === "green") {
                    maxGreen = Math.max(maxGreen, number)
                }
            }
        }
        sum += maxRed * maxBlue * maxGreen;
    }
    console.log(sum)
}

run()
