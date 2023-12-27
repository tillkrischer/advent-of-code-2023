import * as fs from "fs/promises";
import { matrix_invert } from "./matrix";

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

const matrixTimesVector = (M: number[][], v: number[]) => {
  const product = [];
  for (let i = 0; i < M.length; i++) {
    let sum = 0;
    for (let j = 0; j < M[0].length; j++) {
      sum += M[i][j] * v[j];
    }
    product.push(sum);
  }
  return product;
}

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

  const a = hailstones[0];
  const b = hailstones[1];
  const c = hailstones[2];

  const M: number[][] = [
    [0, a.vz - b.vz, b.vy - a.vy, 0, b.pz - a.pz, a.py - b.py],
    [b.vz - a.vz, 0, a.vx - b.vx, a.pz - b.pz, 0, b.px - a.px],
    [a.vy - b.vy, b.vx - a.vx, 0, b.py - a.py, a.px - b.px, 0],
    [0, a.vz - c.vz, c.vy - a.vy, 0, c.pz - a.pz, a.py - c.py],
    [c.vz - a.vz, 0, a.vx - c.vx, a.pz - c.pz, 0, c.px - a.px],
    [a.vy - c.vy, c.vx - a.vx, 0, c.py - a.py, a.px - c.px, 0],
  ];

  let Minv = matrix_invert(M);

  const v = [
    a.py * a.vz - a.pz * a.vy - b.py * b.vz + b.pz * b.vy,
    a.pz * a.vx - a.px * a.vz - b.pz * b.vx + b.px * b.vz,
    a.px * a.vy - a.py * a.vx - b.px * b.vy + b.py * b.vx,
    a.py * a.vz - a.pz * a.vy - c.py * c.vz + c.pz * c.vy,
    a.pz * a.vx - a.px * a.vz - c.pz * c.vx + c.px * c.vz,
    a.px * a.vy - a.py * a.vx - c.px * c.vy + c.py * c.vx,
  ];

  const product = matrixTimesVector(Minv, v);

  // not quite right, because of floating point?
  console.log(product[0] + product[1] + product[2]);
};

run();