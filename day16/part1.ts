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
) => {
  if (
    y < 0 ||
    y >= grid.length ||
    x < 0 ||
    x >= grid[0].length ||
    energized[y][x].indexOf(direction) > 0
  ) {
    return;
  }
  energized[y][x].push(direction);
  const c = grid[y][x];

  if (direction === Direction.Left) {
    if (c === "|") {
      beam(grid, energized, y - 1, x, Direction.Up);
      beam(grid, energized, y + 1, x, Direction.Down);
    } else if (c === "/") {
      beam(grid, energized, y + 1, x, Direction.Down);
    } else if (c === "\\") {
      beam(grid, energized, y - 1, x, Direction.Up);
    } else {
      beam(grid, energized, y, x - 1, Direction.Left);
    }
  } else if (direction === Direction.Right) {
    if (c === "|") {
      beam(grid, energized, y - 1, x, Direction.Up);
      beam(grid, energized, y + 1, x, Direction.Down);
    } else if (c === "/") {
      beam(grid, energized, y - 1, x, Direction.Up);
    } else if (c === "\\") {
      beam(grid, energized, y + 1, x, Direction.Down);
    } else {
      beam(grid, energized, y, x + 1, Direction.Right);
    }
  } else if (direction === Direction.Up) {
    if (c === "-") {
      beam(grid, energized, y, x + 1, Direction.Right);
      beam(grid, energized, y, x - 1, Direction.Left);
    } else if (c === "/") {
      beam(grid, energized, y, x + 1, Direction.Right);
    } else if (c === "\\") {
      beam(grid, energized, y, x - 1, Direction.Left);
    } else {
      beam(grid, energized, y - 1, x, Direction.Up);
    }
  } else if (direction === Direction.Down) {
    if (c === "-") {
      beam(grid, energized, y, x + 1, Direction.Right);
      beam(grid, energized, y, x - 1, Direction.Left);
    } else if (c === "/") {
      beam(grid, energized, y, x - 1, Direction.Left);
    } else if (c === "\\") {
      beam(grid, energized, y, x + 1, Direction.Right);
    } else {
      beam(grid, energized, y + 1, x, Direction.Down);
    }
  }
};

const run = async () => {
  // const content = await fs.readFile("day16/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day16/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));
  const energized: Direction[][][] = new Array(grid.length)
    .fill(false)
    .map(() => new Array(grid[0].length).fill(false).map(() => []));

  beam(grid, energized, 0, 0, Direction.Right);

  // for (const l of grid) {
  //   console.log(l.join(""));
  // }
  // for (const l of energized) {
  //   console.log(l.map(c => c.length > 0 ? '#' : '.').join(""));
  // }

  let sum = 0;
  for (const l of energized) {
    for (const c of l) {
      if (c.length > 0) {
        sum += 1;
      }
    }
  }
  console.log(sum);
};

run();
