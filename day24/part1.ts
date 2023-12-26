import * as fs from "fs/promises";

const AREA_MIN = 200_000_000_000_000
const AREA_MAX = 400_000_000_000_000
// const AREA_MIN = 7;
// const AREA_MAX = 27;

type Hailstone = {
  px: number;
  py: number;
  pz: number;
  vx: number;
  vy: number;
  vz: number;
};

const parseHailstone = (s: string): Hailstone => {
  const match = s.match(/(\d+), (\d+), (\d+) @ (-?\d+), (-?\d+), (-?\d+)/);
  const numbers = match.slice(1).map((s) => Number.parseInt(s));
  return {
    px: numbers[0],
    py: numbers[1],
    pz: numbers[2],
    vx: numbers[3],
    vy: numbers[4],
    vz: numbers[5],
  };
};

const intersectPaths = (a: Hailstone, b: Hailstone) => {
  const ra = a.py;
  const sa = (a.vy * a.px) / a.vx;
  const qa = a.vy / a.vx;
  const rb = b.py;
  const sb = (b.vy * b.px) / b.vx;
  const qb = b.vy / b.vx;

  const x = (ra - sa - rb + sb) / (qb - qa);
  const y = a.py + (a.vy * (x - a.px)) / a.vx;

  const ta = (x - a.px) / a.vx;
  const tb = (x - b.px) / b.vx;

  return ta >= 0 && tb >= 0 && x >= AREA_MIN && x <= AREA_MAX && y >= AREA_MIN && y <= AREA_MAX;
};

const run = async () => {
  // const content = await fs.readFile("day24/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day24/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");
  const hailstones: Hailstone[] = [];
  for (const line of lines) {
    const hailstone = parseHailstone(line);
    hailstones.push(hailstone);
  }

  let count = 0;
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i+1; j < hailstones.length; j++) {
      if (intersectPaths(hailstones[i], hailstones[j])) {
        count += 1;
      }
    }
  }
  console.log(count);
};

run();

// const a = {px: 5, py: 5, vx: 1, vy: 1} as Hailstone;
// const b = {px: 5, py: 6, vx: 1, vy: 1} as Hailstone;
// const result = intersectPaths(a, b);
// console.log(result)
