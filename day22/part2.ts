import * as fs from "fs/promises";

type Brick = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

const readBrick = (s: string): Brick => {
  const match = s.match(/(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/);
  const numbers = match.slice(1).map((s) => Number.parseInt(s));
  const [minX, maxX] =
    numbers[0] < numbers[3]
      ? [numbers[0], numbers[3]]
      : [numbers[3], numbers[0]];
  const [minY, maxY] =
    numbers[1] < numbers[4]
      ? [numbers[1], numbers[4]]
      : [numbers[4], numbers[1]];
  const [minZ, maxZ] =
    numbers[2] < numbers[5]
      ? [numbers[2], numbers[5]]
      : [numbers[5], numbers[2]];

  return { minX, maxX, minY, maxY, minZ, maxZ };
};

const intersect = (a: Brick, b: Brick) => {
  return (
    ((a.minX <= b.minX && b.minX <= a.maxX) ||
      (b.minX <= a.minX && a.minX <= b.maxX)) &&
    ((a.minY <= b.minY && b.minY <= a.maxY) ||
      (b.minY <= a.minY && a.minY <= b.maxY)) &&
    ((a.minZ <= b.minZ && b.minZ <= a.maxZ) ||
      (b.minZ <= a.minZ && a.minZ <= b.maxZ))
  );
};

const canMoveDown = (i: number, bricks: Brick[]): boolean => {
  const brick = bricks[i];
  if (brick.minZ <= 1) {
    return false;
  }

  const moved = movedDown(brick);
  for (let j = 0; j < bricks.length ; j++) {
    if (j !== i && intersect(moved, bricks[j])) {
      return false;
    }
  }
  return true;
};

const movedDown = (brick: Brick): Brick => {
  return { ...brick, minZ: brick.minZ - 1, maxZ: brick.maxZ - 1 };
};

const fall = (bricks: Brick[]): number => {
  let change = true;
  const fallen = new Set<number>();
  while (change) {
    change = false;
    for (let i = 0; i < bricks.length; i++) {
      if (canMoveDown(i, bricks)) {
        fallen.add(i);
        bricks[i] = movedDown(bricks[i]);
        if (!change) {
          change = true;
        }
      }
    }
  }
  return fallen.size;
};

const logXView = (bricks: Brick[]) => {
  const x = Math.max(...bricks.map((b) => b.maxX));
  const z = Math.max(...bricks.map((b) => b.maxZ));
  const grid: string[][] = new Array(z + 1)
    .fill(false)
    .map((_) => new Array(x + 1).fill("."));

  for (let x = 0; x < bricks.length; x++) {
    const b = bricks[x];
    for (let i = b.minZ; i <= b.maxZ; i++) {
      for (let j = b.minX; j <= b.maxX; j++) {
        if (grid[z - i][j] !== ".") {
          grid[z - i][j] = "?";
        } else {
          grid[z - i][j] = String.fromCharCode("A".charCodeAt(0) + x);
        }
      }
    }
  }

  for (const l of grid) {
    console.log(l.join(""));
  }
};

const logYView = (bricks: Brick[]) => {
  const y = Math.max(...bricks.map((b) => b.maxX));
  const z = Math.max(...bricks.map((b) => b.maxZ));
  const grid: string[][] = new Array(z + 1)
    .fill(false)
    .map((_) => new Array(y + 1).fill("."));

  for (let x = 0; x < bricks.length; x++) {
    const b = bricks[x];
    for (let i = b.minZ; i <= b.maxZ; i++) {
      for (let j = b.minY; j <= b.maxY; j++) {
        if (grid[z - i][j] !== ".") {
          grid[z - i][j] = "?";
        } else {
          grid[z - i][j] = String.fromCharCode("A".charCodeAt(0) + x);
        }
      }
    }
  }

  for (const l of grid) {
    console.log(l.join(""));
  }
};

const disintegrate = (i: number, bricks: Brick[]): number => {
  const removed = [...bricks];
  removed.splice(i, 1);
  return fall(removed);
};

const run = async () => {
  // const content = await fs.readFile("day22/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day22/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");

  let maxHeight = 0;
  const bricks: Brick[] = [];
  for (const line of lines) {
    const b = readBrick(line);
    bricks.push(b);
    maxHeight = Math.max(maxHeight, b.maxZ - b.minZ);
  }
  // bricks.sort((a, b) => a.minZ - b.minZ);

  console.log('falling...')

  fall(bricks);

  let sum = 0;
  for (let i = 0; i < bricks.length; i++) {
    console.log('disintegrating', i)
    sum += disintegrate(i, bricks);
  }
  console.log(sum)
};

run();
