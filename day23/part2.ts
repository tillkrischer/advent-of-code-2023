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
    console.log(stack.length);
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

const run2 = async () => {
  // const content = await fs.readFile("day23/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day23/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));

  const result = walk(grid);
  console.log(result);
};

const walkToNeighbours = (
  grid: string[][],
  vertexGrid: number[][],
  visited: boolean[][],
  edges: number[][],
  pos: Pos,
  startVertex: number,
  dist: number
) => {
  const vertex = vertexGrid[pos.y][pos.x];
  if (vertex !== undefined && vertex !== startVertex) {
    edges[startVertex][vertex] = dist;
    edges[vertex][startVertex] = dist;
    return;
  }
  visited[pos.y][pos.x] = true;
  for (const adj of getNext(grid, visited, pos)) {
    if (!visited[adj.y][adj.x]) {
      walkToNeighbours(
        grid,
        vertexGrid,
        visited,
        edges,
        adj,
        startVertex,
        dist + 1
      );
    }
  }
};

const getEdges = (
  grid: string[][],
  vertexGrid: number[][],
  vertexCount: number
) => {
  const edges: number[][] = new Array(vertexCount)
    .fill(false)
    .map((_) => new Array(vertexCount));
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const vertex = vertexGrid[i][j];
      if (vertex !== undefined) {
        const visited = new Array(grid.length)
          .fill(false)
          .map((_) => new Array(grid[0].length).fill(false));
        walkToNeighbours(
          grid,
          vertexGrid,
          visited,
          edges,
          {
            y: i,
            x: j,
          },
          vertex,
          0
        );
      }
    }
  }
  return edges;
};

const printVertices = (grid: string[][], vertexGrid: number[][]) => {
  for (let i = 0; i < grid.length; i++) {
    let s = ""
    for (let j = 0; j < grid[0].length; j++) {
      const vertex = vertexGrid[i][j];
      if (vertex!== undefined) {
        s += vertex % 10;
      } else {
        s += grid[i][j];
      }
    }
    console.log(s)
  }
}

const getGraph = (grid: string[][]): number[][] => {
  const vertexGrid: number[][] = new Array(grid.length)
    .fill(false)
    .map((_) => new Array(grid[0].length));
  const visited: boolean[][] = new Array(grid.length)
    .fill(false)
    .map((_) => new Array(grid[0].length).fill(false));
  vertexGrid[0][1] = 0;
  vertexGrid[grid.length - 1][grid[0].length - 2] = 1;
  let vertexCount = 2;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] !== '#') {
        const next = getNext(grid, visited, { y: i, x: j });
        if (next.length > 2) {
          vertexGrid[i][j] = vertexCount;
          vertexCount += 1;
        }
      }
    }
  }

  // printVertices(grid, vertexGrid);
  const edges = getEdges(grid, vertexGrid, vertexCount);
  return edges;
};

const longestWalk = (edges: number[][], visited: boolean[], current: number, dist: number) => {
  if (current === 1) {
    return dist;
  }
  let longest = 0;
  visited[current] = true;
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[current][i];
    if(edge !== undefined && !visited[i]) {
      const walk = longestWalk(edges, visited, i, dist + edge);
      longest = Math.max(longest, walk)
    }
  }
  visited[current] = false;
  return longest;
}

const run = async () => {
  // const content = await fs.readFile("day23/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day23/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split(""));

  const edges = getGraph(grid);

  const visited = new Array(edges.length).fill(false);
  const longest = longestWalk(edges, visited, 0, 0);
  console.log(longest);
};

run();
