import * as fs from 'fs/promises'

const iterate = (grid: string[][]) => {
    for (let i = 1; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'O' && grid[i - 1][j] === '.') {
                grid[i][j] = '.';
                grid[i - 1][j] = 'O';
            }
        }
    }
}

const stringify = (grid: string[][]) => {
    return grid.map(l => l.join()).join();
}

const countWeight = (grid: string[][]) => {
    let weight = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'O') {
                weight += (grid.length - i)
            }
        }
    }
    return weight;
}

const run = async () => {
    // const content = await fs.readFile('day14/test-input.txt', {encoding: 'utf8'});
    const content = await fs.readFile('day14/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');
    const grid = lines.map(l => l.split(""));

    let state = "";
    while (state !== stringify(grid)) {
        state = stringify(grid);
        iterate(grid);
    }

    const result = countWeight(grid);
    console.log(result);

    // for (const l of grid) {
    //     console.log(l.join(""))
    // }
}


run()


