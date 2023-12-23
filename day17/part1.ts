import * as fs from "fs/promises";

type Vertex = {
  y: number;
  x: number;
  straight: number;
  direction: "up" | "down" | "left" | "right";
  isDestination?: boolean;
};

const getKey = (v: Vertex) => {
  if (v.isDestination) {
    return "destination";
  }
  return `${v.y},${v.x},${v.straight},${v.direction}`;
};

class VertexSet {
  private map: Map<string, Vertex>;

  constructor() {
    this.map = new Map();
    this[Symbol.iterator] = this.values();
  }

  values() {
    return this.map.values();
  }

  add(v: Vertex) {
    this.map.set(getKey(v), v);
  }

  delete(v: Vertex) {
    this.map.delete(getKey(v));
  }

  size() {
    return this.map.size;
  }

  has(v: Vertex) {
    return this.map.has(getKey(v));
  }
}

class VertexMap<T> {
  private map: Map<string, T>;

  constructor() {
    this.map = new Map();
  }

  set(k: Vertex, v: T) {
    return this.map.set(getKey(k), v);
  }

  get(k: Vertex) {
    return this.map.get(getKey(k));
  }
}

const getNeighbours = (grid: number[][], v: Vertex): Vertex[] => {
  const neighbours: Vertex[] = [];
  const height = grid.length;
  const width = grid[0].length;

  if (v.isDestination) {
    return [];
  }

  if (v.x === width - 1 && v.y  === height -1) {
    neighbours.push({
      x: -1,
      y: -1,
      straight: -1,
      direction: 'up',
      isDestination: true,
    })
  }

  if (v.direction === "right") {
    if (v.straight !== 3 && v.x < width - 1) {
      neighbours.push({
        x: v.x + 1,
        y: v.y,
        straight: v.straight + 1,
        direction: "right",
      });
    }
    if (v.y > 0) {
      neighbours.push({
        x: v.x,
        y: v.y - 1,
        straight: 1,
        direction: "up",
      });
    }
    if (v.y < height - 1) {
      neighbours.push({
        x: v.x,
        y: v.y + 1,
        straight: 1,
        direction: "down",
      });
    }
  }
  if (v.direction === "left") {
    if (v.straight !== 3 && v.x > 0) {
      neighbours.push({
        x: v.x - 1,
        y: v.y,
        straight: v.straight + 1,
        direction: "left",
      });
    }
    if (v.y > 0) {
      neighbours.push({
        x: v.x,
        y: v.y - 1,
        straight: 1,
        direction: "up",
      });
    }
    if (v.y < height - 1) {
      neighbours.push({
        x: v.x,
        y: v.y + 1,
        straight: 1,
        direction: "down",
      });
    }
  }
  if (v.direction === "up") {
    if (v.straight !== 3 && v.y > 0) {
      neighbours.push({
        x: v.x,
        y: v.y - 1,
        straight: v.straight + 1,
        direction: "up",
      });
    }
    if (v.x > 0) {
      neighbours.push({
        x: v.x - 1,
        y: v.y,
        straight: 1,
        direction: "left",
      });
    }
    if (v.x < width - 1) {
      neighbours.push({
        x: v.x + 1,
        y: v.y,
        straight: 1,
        direction: "right",
      });
    }
  }
  if (v.direction === "down") {
    if (v.straight !== 3 && v.y < height - 1) {
      neighbours.push({
        x: v.x,
        y: v.y + 1,
        straight: v.straight + 1,
        direction: "down",
      });
    }
    if (v.x > 0) {
      neighbours.push({
        x: v.x - 1,
        y: v.y,
        straight: 1,
        direction: "left",
      });
    }
    if (v.x < width - 1) {
      neighbours.push({
        x: v.x + 1,
        y: v.y,
        straight: 1,
        direction: "right",
      });
    }
  }

  return neighbours;
};

const getEdge = (grid: number[][], u: Vertex, v: Vertex): number => {
  if (v.isDestination) {
    return 0;
  }
  return grid[v.y][v.x];
};

const getMinDist = (Q: VertexSet, dist: VertexMap<number>) => {
  let minDist = Number.MAX_VALUE;
  let minVertex: Vertex | undefined = undefined;
  for (const v of Q.values()) {
    const d = dist.get(v);
    if (d < minDist) {
      minDist = d;
      minVertex = v;
    }
  }
  Q.delete(minVertex);
  return minVertex;
};

const hasUnvisitedConnected = (Q: VertexSet, dist: VertexMap<number>) => {
  return ![...Q.values()].map(v => dist.get(v)).every(dist => dist === Number.MAX_VALUE)
}

const run = async () => {
  // const content = await fs.readFile("day17/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day17/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split("").map((c) => Number.parseInt(c)));
  // console.log(grid);

  const dist = new VertexMap<number>();
  const Q = new VertexSet();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      for (const direction of ["up", "down", "left", "right"] as const) {
        for (let straight = 1; straight <= 3; straight++) {
          const v: Vertex = {
            y: i,
            x: j,
            straight: straight,
            direction: direction,
          };
          dist.set(v, Number.MAX_VALUE);
          Q.add(v);
        }
      }
    }
  }
  const start: Vertex = {
    y: 0,
    x: 0,
    straight: 0,
    direction: "right",
  };
  const destination: Vertex = {
    y: 0,
    x: 0,
    straight: 0,
    direction: "right",
    isDestination: true,
  };
  dist.set(start, 0);
  Q.add(start);
  dist.set(destination, Number.MAX_VALUE);
  Q.add(destination);

  while (hasUnvisitedConnected(Q, dist)) {
    const u = getMinDist(Q, dist);
    const nbhs = getNeighbours(grid, u).filter((n) => Q.has(n));
    for (const v of nbhs) {
      const alt = dist.get(u) + getEdge(grid, u, v);
      if (alt < dist.get(v)) {
        dist.set(v, alt);
      }
    }
  }

  const shortest = dist.get(destination);
  console.log(shortest);
};

run();
