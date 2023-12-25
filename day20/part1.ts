import * as fs from "fs/promises";

const moduleTypes = ["flip-flop", "conjunction", "broadcast"] as const;
type ModuleType = (typeof moduleTypes)[number];

type Module = {
  type: "flip-flop" | "conjunction" | "broadcast";
  name: string;
  destinations: string[];
};

const pulseTypes = ["high", "low"] as const;
type PulseType = (typeof pulseTypes)[number];

type Pulse = {
  origin: string;
  destination: string;
  type: PulseType;
};

const parseModule = (s: string): Module => {
  const match = s.match(/([%&]?)(\w+) -> (.*)/);
  let type: ModuleType = "broadcast";
  if (match[1] === "%") {
    type = "flip-flop";
  }
  if (match[1] === "&") {
    type = "conjunction";
  }

  return {
    type: type,
    name: match[2],
    destinations: match[3].split(", "),
  };
};

const pressButton = (
  modules: Map<string, Module>,
  flipFlopOn: Map<string, boolean>,
  conjuctionLastInputs: Map<string, Map<string, PulseType>>
): { lowCount: number; highCount: number } => {
  let lowCount = 0;
  let highCount = 0;
  const queue: Pulse[] = [];
  queue.push({ type: "low", destination: "broadcaster", origin: "button" });

  while (queue.length > 0) {
    const pulse = queue.shift();
    // console.log(`${pulse.origin} -${pulse.type}-> ${pulse.destination}`);
    if (pulse.type === "high") {
      highCount += 1;
    } else {
      lowCount += 1;
    }

    const module = modules.get(pulse.destination);

    if (module?.type === "broadcast") {
      for (const dest of module.destinations) {
        queue.push({
          type: pulse.type,
          destination: dest,
          origin: pulse.destination,
        });
      }
    }

    if (module?.type === "flip-flop" && pulse.type === "low") {
      const on = flipFlopOn.get(module.name);
      for (const dest of module.destinations) {
        queue.push({
          type: on ? "low" : "high",
          destination: dest,
          origin: pulse.destination,
        });
      }
      flipFlopOn.set(module.name, !on);
    }

    if (module?.type === "conjunction") {
      const lastInputs = conjuctionLastInputs.get(module.name);
      lastInputs.set(pulse.origin, pulse.type);
      const allHigh = [...lastInputs.values()].every((i) => i === "high");
      for (const dest of module.destinations) {
        queue.push({
          origin: pulse.destination,
          type: allHigh ? "low" : "high",
          destination: dest,
        });
      }
    }
  }

  return { lowCount, highCount };
};

const run = async () => {
  // const content = await fs.readFile("day20/test-input.txt", {
  //   encoding: "utf8",
  // });
  // const content = await fs.readFile("day20/test-input2.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day20/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");

  const modules = new Map<string, Module>();
  const flipFlopOn = new Map<string, boolean>();
  const conjuctionLastInputs = new Map<string, Map<string, PulseType>>();

  for (const line of lines) {
    const module = parseModule(line);
    if (module.type === "flip-flop") {
      flipFlopOn.set(module.name, false);
    }
    if (module.type === "conjunction") {
      conjuctionLastInputs.set(module.name, new Map());
    }
    modules.set(module.name, module);
  }

  for (const module of modules.values()) {
    for (const dest of module.destinations) {
      const destinationModule = modules.get(dest);
      if (destinationModule && destinationModule.type === "conjunction") {
        conjuctionLastInputs
          .get(destinationModule.name)
          .set(module.name, "low");
      }
    }
  }

  let low = 0;
  let high = 0;
  for (let i = 0; i < 1000; i++) {
    const {highCount, lowCount} = pressButton(modules, flipFlopOn, conjuctionLastInputs);
    low += lowCount;
    high += highCount;
  }
  const product = low * high;
  console.log(product);
};

run();
