import * as fs from "fs/promises";

type Lens = {
  label: string;
  focalLength: number;
};

const hash = (s: string) => {
  let currentValue = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    currentValue += c;
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
};

const run = async () => {
  // const content = await fs.readFile("day15/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day15/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");

  const steps = lines[0].split(",");
  const boxes: Lens[][] = new Array(256).fill(false).map(() => []);
  for (const step of steps) {
    const result = step.match(/(.*)([-=])(.*)/);
    const label = result[1];
    const box = hash(label)
    const operation = result[2];
    if (operation === '=') {
      const focalLength = Number.parseInt(result[3]);
      const lens: Lens = {focalLength: focalLength, label: label};
      const existingIndex = boxes[box].findIndex(e => e.label === label);
      if (existingIndex !== -1) {
        boxes[box][existingIndex] = lens;
      } else {
        boxes[box].push(lens);
      }
    } else if (operation === '-') {
      const existingIndex = boxes[box].findIndex(e => e.label === label);
      if (existingIndex !== -1) {
        boxes[box].splice(existingIndex, 1);
      }
    }
  }
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    for (let j = 0; j < boxes[i].length; j++) {
      sum += (i+1) * (j+1) * boxes[i][j].focalLength;
    }
  }
  console.log(sum);
};

run();
