import * as fs from "fs/promises";

type Pos = {
  y: number;
  x: number;
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

const getForN = (grid: string[][], steps: number, startPos: Pos) => {
  // const startPos = findStart(grid);
  let reachable: boolean[][] = new Array(grid.length)
    .fill(false)
    .map(() => new Array(grid[0].length));
  reachable[startPos.y][startPos.x] = true;
  for (let i = 0; i < steps; i++) {
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
  return sum;
};

const run2 = async () => {
  // const content = await fs.readFile("day21/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day21/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));
  // console.log(grid.length);

  const steps = 26501365;
  const partialCornerACount = Math.floor((steps - 1) / 131);
  const partialCornerAStepsRemaining = (steps - 1) % 131;
  const partialCornerBCount = partialCornerACount;
  const partialCornerBStepsRemaining = partialCornerAStepsRemaining + 131;

  const nev = Math.floor((steps - 263) / 262);
  const fullCornerEven = nev * (nev + 1);
  const nod = Math.floor((steps - 132) / 262);
  const fullCornerOdd = (nod - 1) * (nod + 1) + 1;

  const partialEdgeStepsRemaining = (steps - 66) % 131;

  const fullEdgeEven = Math.floor((steps - 66) / 262);
  const fullEdgeOdd = Math.floor((steps - 66) / 262);

  // console.log({
  //   partialCornerACount,
  //   partialCornerAStepsRemaining,
  //   partialCornerBCount,
  //   partialCornerBStepsRemaining,
  //   partialEdgeStepsRemaining,
  // });
  //
  // console.log({
  //   fullCornerEven,
  //   fullCornerOdd,
  //   fullEdgeEven,
  //   fullEdgeOdd,
  // });

  const topLeftA = getForN(grid, partialCornerAStepsRemaining, { x: 0, y: 0 });
  const topLeftB = getForN(grid, partialCornerBStepsRemaining, { x: 0, y: 0 });
  const topRightA = getForN(grid, partialCornerAStepsRemaining, {
    x: 130,
    y: 0,
  });
  const topRightB = getForN(grid, partialCornerBStepsRemaining, {
    x: 130,
    y: 0,
  });
  const bottomLeftA = getForN(grid, partialCornerAStepsRemaining, {
    x: 0,
    y: 130,
  });
  const bottomLeftB = getForN(grid, partialCornerBStepsRemaining, {
    x: 0,
    y: 130,
  });
  const bottomRightA = getForN(grid, partialCornerAStepsRemaining, {
    x: 130,
    y: 130,
  });
  const bottomRightB = getForN(grid, partialCornerBStepsRemaining, {
    x: 130,
    y: 130,
  });
  const middleLeft = getForN(grid, partialEdgeStepsRemaining, { x: 0, y: 65 });
  const middleRight = getForN(grid, partialEdgeStepsRemaining, {
    x: 130,
    y: 65,
  });
  const middleTop = getForN(grid, partialEdgeStepsRemaining, { x: 65, y: 0 });
  const middleBottom = getForN(grid, partialEdgeStepsRemaining, {
    x: 65,
    y: 130,
  });

  // console.log({ topLeftA, topRightA, bottomLeftA, bottomRightA });
  // console.log({ topLeftB, topRightB, bottomLeftB, bottomRightB });
  // console.log({ middleLeft, middleRight, middleTop, middleBottom });

  let sum = 0;
  sum += 7523;
  sum += 4 * fullEdgeOdd * 7584;
  sum += 4 * fullEdgeEven * 7523;
  sum += 4 * fullCornerEven * 7584;
  sum += 4 * fullCornerOdd * 7523;
  sum += middleLeft;
  sum += middleRight;
  sum += middleBottom;
  sum += middleTop;
  sum += partialCornerACount * topLeftA;
  sum += partialCornerACount * topRightA;
  sum += partialCornerACount * bottomLeftA;
  sum += partialCornerACount * bottomRightA;
  sum += partialCornerBCount * topLeftB;
  sum += partialCornerBCount * topRightB;
  sum += partialCornerBCount * bottomLeftB;
  sum += partialCornerBCount * bottomRightB;
  console.log("sum", sum);

  const oddFull = 1 + 4 * fullEdgeEven + 4 * fullCornerOdd;
  console.log(oddFull)
};

const step2 = (
  grid: string[][],
  reachable: (number | null)[][],
  dist: number
) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (reachable[i][j] === dist) {
        for (const adj of getAdjacents(grid, { y: i, x: j })) {
          const current = reachable[adj.y][adj.x] ?? Number.MAX_VALUE;
          reachable[adj.y][adj.x] = Math.min(current, dist + 1);
        }
      }
    }
  }
};

const getDistances = (grid: string[][]): (number | null)[][] => {
  const distances: (number | null)[][] = new Array(131)
    .fill(false)
    .map((_) => new Array(131).fill(null));
  distances[65][65] = 0;

  for (let i = 0; i < 500; i++) {
    step2(grid, distances, i);
  }
  return distances;
};

const run = async () => {
  // const content = await fs.readFile("day21/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day21/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));

  const distances = getDistances(grid);

  const plots = distances.flatMap(d => d)
      .filter(d => d!== null);

  const evenCorners = plots
      .filter(d => d%2 == 0)
      .filter(d => d > 65)
      .length;
  const oddCorners = plots
      .filter(d => d%2 == 1)
      .filter(d => d > 65)
      .length;
  const evenFull = plots
      .filter(d => d%2 == 0)
      .length;
  const oddFull = plots
      .filter(d => d%2 == 1)
      .length;

  const n = 202300;
  const p2 = ((n+1)*(n+1)) * oddFull + (n*n) * evenFull - (n+1) * oddCorners + n * evenCorners;
  console.log(p2);
};

run();
// run2();