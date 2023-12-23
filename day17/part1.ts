import * as fs from "fs/promises";
import { MinHeap } from "./heap";

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

class VertexMap<T> {
  private map: Map<string, T>;

  constructor() {
    this.map = new Map();
  }

  set(k: Vertex, v: T) {
    return this.map.set(getKey(k), v);
  }

  get(k: Vertex): T | undefined {
    return this.map.get(getKey(k));
  }

  getDestination() {
    return this.map.get("destination");
  }
}

const getNeighbours = (grid: number[][], v: Vertex): Vertex[] => {
  const neighbours: Vertex[] = [];
  const height = grid.length;
  const width = grid[0].length;

  if (v.isDestination) {
    return [];
  }

  if (v.x === width - 1 && v.y === height - 1) {
    neighbours.push({
      x: -1,
      y: -1,
      straight: -1,
      direction: "up",
      isDestination: true,
    });
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

const run = async () => {
  // const content = await fs.readFile("day17/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day17/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const grid = lines.map((l) => l.split("").map((c) => Number.parseInt(c)));

  const dist = new VertexMap<number>();
  const Q = new MinHeap<Vertex>();

  const start: Vertex = {
    y: 0,
    x: 0,
    straight: 0,
    direction: "right",
  };
  Q.enq(start, 0);
  dist.set(start, 0);

  while (Q.size() > 0) {
    const u = Q.deq();
    const nbhs = getNeighbours(grid, u);
    for (const v of nbhs) {
      const alt = dist.get(u) + getEdge(grid, u, v);
      if (alt < (dist.get(v) ?? Number.MAX_VALUE)) {
        dist.set(v, alt);
        Q.enq(v, alt);
      }
    }
  }

  const shortest = dist.getDestination();
  console.log(shortest);
};

run();
