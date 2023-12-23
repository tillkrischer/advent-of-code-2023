import * as fs from "fs/promises";

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const beam = (
  grid: string[][],
  energized: Direction[][][],
  y: number,
  x: number,
  direction: Direction
): number => {
  if (
    y < 0 ||
    y >= grid.length ||
    x < 0 ||
    x >= grid[0].length ||
    energized[y][x].indexOf(direction) > 0
  ) {
    return 0;
  }
  let count = 0;
  if (energized[y][x].length === 0) {
    count += 1;
  }
  energized[y][x].push(direction);
  const c = grid[y][x];

  if (direction === Direction.Left) {
    if (c === "|") {
      count += beam(grid, energized, y - 1, x, Direction.Up);
      count += beam(grid, energized, y + 1, x, Direction.Down);
    } else if (c === "/") {
      count += beam(grid, energized, y + 1, x, Direction.Down);
    } else if (c === "\\") {
      count += beam(grid, energized, y - 1, x, Direction.Up);
    } else {
      count += beam(grid, energized, y, x - 1, Direction.Left);
    }
  } else if (direction === Direction.Right) {
    if (c === "|") {
      count += beam(grid, energized, y - 1, x, Direction.Up);
      count += beam(grid, energized, y + 1, x, Direction.Down);
    } else if (c === "/") {
      count += beam(grid, energized, y - 1, x, Direction.Up);
    } else if (c === "\\") {
      count += beam(grid, energized, y + 1, x, Direction.Down);
    } else {
      count += beam(grid, energized, y, x + 1, Direction.Right);
    }
  } else if (direction === Direction.Up) {
    if (c === "-") {
      count += beam(grid, energized, y, x + 1, Direction.Right);
      count += beam(grid, energized, y, x - 1, Direction.Left);
    } else if (c === "/") {
      count += beam(grid, energized, y, x + 1, Direction.Right);
    } else if (c === "\\") {
      count += beam(grid, energized, y, x - 1, Direction.Left);
    } else {
      count += beam(grid, energized, y - 1, x, Direction.Up);
    }
  } else if (direction === Direction.Down) {
    if (c === "-") {
      count += beam(grid, energized, y, x + 1, Direction.Right);
      count += beam(grid, energized, y, x - 1, Direction.Left);
    } else if (c === "/") {
      count += beam(grid, energized, y, x - 1, Direction.Left);
    } else if (c === "\\") {
      count += beam(grid, energized, y, x + 1, Direction.Right);
    } else {
      count += beam(grid, energized, y + 1, x, Direction.Down);
    }
  }
  return count;
};

const tryStart = (
  grid: string[][],
  y: number,
  x: number,
  direction: Direction
) => {
  const energized: Direction[][][] = new Array(grid.length)
    .fill(false)
    .map(() => new Array(grid[0].length).fill(false).map(() => []));

  return beam(grid, energized, y, x, direction);
};

const run = async () => {
  // const content = await fs.readFile("day16/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day16/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));

  let max = 0;
  for (let i = 0; i < grid.length; i++) {
    const tilesRight = tryStart(grid, i, 0, Direction.Right)
    const tilesLeft = tryStart(grid, i, grid[0].length -1, Direction.Left)
    max = Math.max(max, tilesLeft, tilesRight)
  }
  for (let i = 0; i < grid[0].length; i++) {
    const tilesTop = tryStart(grid, 0, i, Direction.Down);
    const tilesBottom = tryStart(grid, grid.length -1, i, Direction.Up);
    max = Math.max(max, tilesBottom, tilesTop)
  }
  console.log(max);
};


run();
