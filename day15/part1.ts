import * as fs from "fs/promises";

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
  let sum = 0;
  for (const step of steps) {
    const hashValue = hash(step);
    sum += hashValue;
  }
  console.log(sum);
};

run();
