import * as fs from "fs/promises";

type Vertex = {
  x: number;
  y: number;
};

const shoelace =  (vertices: Vertex[]) => {
  const n = vertices.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += vertices[i].y * (vertices[(i-1+n)%n].x - vertices[(i+1)%n].x);
  }
  return sum / 2;
}

const run = async () => {
  // const content = await fs.readFile("day18/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day18/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");

  const vertices: Vertex[] = [];
  let x = 0;
  let y = 0;
  let border = 0;
  for (const line of lines) {
    const split = line.split(/\s+/);
    const direction = split[2].at(-2);
    const distance = Number.parseInt(split[2].slice(2, -2), 16);

    if (direction === '0') {
      x += distance;
    }
    if (direction === '1') {
      y += distance;
    }
    if (direction === '2') {
      x -= distance;
    }
    if (direction === '3') {
      y -= distance;
    }

    border += distance;
    vertices.push({x, y})
  }

  const polygonArea = shoelace(vertices);
  const interior = polygonArea + 1 - (border/2)

  const area = border + interior;
  console.log(area);
};

run();
