import * as fs from "fs/promises";
import { KeyedSet } from "./set";

type Pos = {
  y: number;
  x: number;
};

type CacheEntry = Map<number, KeyedSet<Pos>>;

const findStart = (grid: string[][]): Pos => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[i][j] === "S") {
        return { y: i, x: j };
      }
    }
  }
};

const getAdjacents = (grid: string[][], pos: Pos): Pos[] => {
  const height = grid.length;
  const width = grid[0].length;

  const adjacent: Pos[] = [];
  if (pos.y > 0 && grid[pos.y - 1][pos.x] !== "#") {
    adjacent.push({ y: pos.y - 1, x: pos.x });
  }
  if (pos.y < height - 1 && grid[pos.y + 1][pos.x] !== "#") {
    adjacent.push({ y: pos.y + 1, x: pos.x });
  }
  if (pos.x > 0 && grid[pos.y][pos.x - 1] !== "#") {
    adjacent.push({ y: pos.y, x: pos.x - 1 });
  }
  if (pos.x < width - 1 && grid[pos.y][pos.x + 1] !== "#") {
    adjacent.push({ y: pos.y, x: pos.x + 1 });
  }

  return adjacent;
};

const step = (grid: string[][], reachable: boolean[][]): boolean[][] => {
  const newReachable: boolean[][] = new Array(grid.length)
    .fill(false)
    .map(() => new Array(grid[0].length));

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (reachable[i][j]) {
        for (const adj of getAdjacents(grid, { y: i, x: j })) {
          newReachable[adj.y][adj.x] = true;
        }
      }
    }
  }
  return newReachable;
};

const STEPS = 64;

const run = async () => {
  // const content = await fs.readFile("day21/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day21/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));
  const startPos = findStart(grid);
  let reachable: boolean[][] = new Array(grid.length)
    .fill(false)
    .map(() => new Array(grid[0].length));
  reachable[startPos.y][startPos.x] = true;
  for (let i = 0; i < STEPS; i++) {
    reachable = step(grid, reachable);
  }
  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (reachable[i][j]) {
        sum += 1;
      }
    }
  }
  console.log(sum);
};

run();
