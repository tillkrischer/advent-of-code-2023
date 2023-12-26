import * as fs from "fs/promises";

type Pos = { y: number; x: number };

const canGoUp = (grid: string[][], visited: boolean[][], c: Pos): boolean =>
  c.y > 0 && grid[c.y - 1][c.x] !== "#" && visited[c.y - 1][c.x] === false;

const canGoDown = (grid: string[][], visited: boolean[][], c: Pos): boolean =>
  c.y < grid.length - 1 &&
  grid[c.y + 1][c.x] !== "#" &&
  visited[c.y + 1][c.x] === false;

const canGoLeft = (grid: string[][], visited: boolean[][], c: Pos): boolean =>
  grid[c.y][c.x - 1] !== "#" && visited[c.y][c.x - 1] === false;

const canGoRight = (grid: string[][], visited: boolean[][], c: Pos): boolean =>
  grid[c.y][c.x + 1] !== "#" && visited[c.y][c.x + 1] === false;

const getNext = (
  grid: string[][],
  visited: boolean[][],
  current: Pos
): Pos[] => {
  // const char = grid[current.y][current.x];
  // if (char === ">") {
  //   if (canGoRight(grid, visited, current)) {
  //     return [{ y: current.y, x: current.x + 1 }];
  //   } else {
  //     return [];
  //   }
  // }
  // if (char === "<") {
  //   if (canGoLeft(grid, visited, current)) {
  //     return [{ y: current.y, x: current.x - 1 }];
  //   } else {
  //     return [];
  //   }
  // }
  // if (char === "^") {
  //   if (canGoUp(grid, visited, current)) {
  //     return [{ y: current.y - 1, x: current.x }];
  //   } else {
  //     return [];
  //   }
  // }
  // if (char === "v") {
  //   if (canGoDown(grid, visited, current)) {
  //     return [{ y: current.y + 1, x: current.x }];
  //   } else {
  //     return [];
  //   }
  // }

  const adj: Pos[] = [];
  if (canGoRight(grid, visited, current)) {
    adj.push({ y: current.y, x: current.x + 1 });
  }
  if (canGoLeft(grid, visited, current)) {
    adj.push({ y: current.y, x: current.x - 1 });
  }
  if (canGoUp(grid, visited, current)) {
    adj.push({ y: current.y - 1, x: current.x });
  }
  if (canGoDown(grid, visited, current)) {
    adj.push({ y: current.y + 1, x: current.x });
  }

  return adj;
};

const walk = (grid: string[][]): number => {
  const stack: { visited: boolean[][]; pos: Pos; count: number }[] = [];

  const startVisited: boolean[][] = new Array(grid.length)
    .fill(false)
    .map(() => new Array(grid[0].length).fill(false));
  const startPos = { y: 0, x: 1 };
  stack.push({ visited: startVisited, pos: startPos, count: 0 });

  let max = 0;
  while (stack.length > 0) {
    console.log(stack.length)
    const { visited, pos, count } = stack.pop();
    visited[pos.y][pos.x] = true;
    const next = getNext(grid, visited, pos);

    if (pos.y === grid.length - 1) {
      max = Math.max(max, count);
    }

    for (const adj of next) {
      let newVisited = visited;
      if (next.length) {
        newVisited = visited.map((v) => v.slice());
      }
      stack.push({ visited: newVisited, pos: adj, count: count + 1 });
    }
  }
  return max;
};

const run = async () => {
  // const content = await fs.readFile("day23/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day23/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));

  const result = walk(grid);
  console.log(result);
};

run();
