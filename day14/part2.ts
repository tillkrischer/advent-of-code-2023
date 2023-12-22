import * as fs from "fs/promises";

const tilt = (grid: string[][], yDir: number, xDir: number) => {
  let state = "";
  while (state !== stringify(grid)) {
    state = stringify(grid);
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        const destY = i + yDir;
        const destX = j + xDir;
        if (
          destY >= 0 &&
          destY < grid.length &&
          destX >= 0 &&
          destX < grid[0].length &&
          grid[i][j] === "O" &&
          grid[destY][destX] === "."
        ) {
          grid[i][j] = ".";
          grid[destY][destX] = "O";
        }
      }
    }
  }
};

const stringify = (grid: string[][]) => {
  return grid.map((l) => l.join()).join();
};

const countWeight = (grid: string[][]) => {
  let weight = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "O") {
        weight += grid.length - i;
      }
    }
  }
  return weight;
};

const iterate = (grid: string[][]) => {
  tilt(grid, -1, 0);
  tilt(grid, 0, -1);
  tilt(grid, 1, 0);
  tilt(grid, 0, 1);
}

const run = async () => {
  // const content = await fs.readFile('day14/test-input.txt', {encoding: 'utf8'});
  const content = await fs.readFile("day14/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));

  const iterations = 1_000_000_000;
  const history = new Map<string, number>();
  let i = 0;
  while (i < iterations) {
    iterate(grid);
    i += 1;
    const s = stringify(grid);
    if (history.has(s)) {
      const prev = history.get(s);
      const cycle = i - prev;
      i += Math.floor((iterations - i) / cycle) * cycle;
    }
    history.set(stringify(grid), i);
  }

  const result = countWeight(grid);
  console.log(result);
};

run();
