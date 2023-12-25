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
  conjuctionLastInputs: Map<string, Map<string, PulseType>>,
  count: number
) => {
  const queue: Pulse[] = [];
  queue.push({ type: "low", destination: "broadcaster", origin: "button" });

  while (queue.length > 0) {
    const pulse = queue.shift();
    // console.log(`${pulse.origin} -${pulse.type}-> ${pulse.destination}`);
    if (pulse.type === 'low' && pulse.destination === 'rx') {
      return true;
    }
    if (pulse.type === 'high' && pulse.destination === 'rm' && pulse.origin === 'qd') {
      console.log('qd', count)
    }
    if (pulse.type === 'high' && pulse.destination === 'rm' && pulse.origin === 'dh') {
      console.log('dh', count)
    }
    if (pulse.type === 'high' && pulse.destination === 'rm' && pulse.origin === 'bb') {
      console.log('bb', count)
    }
    if (pulse.type === 'high' && pulse.destination === 'rm' && pulse.origin === 'dp') {
      console.log('dp', count)
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

  return false;
};

const flipFlopState = (state: Map<string, boolean>) => {
  return [...state.entries()]
      .map(e => `${e[0]}:${e[1]}`)
      .join(',');
}

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

  let rxReceivedLow = false;
  let count = 0;
  while (!rxReceivedLow) {
    rxReceivedLow = pressButton(modules, flipFlopOn, conjuctionLastInputs, count);
    count += 1;
  }
  console.log(count);
};

run();
