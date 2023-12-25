import * as fs from "fs/promises";
import { lcm } from "./gcd";

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
  targetPulseType: PulseType,
  targetPulseOrigin: string
) => {
  const queue: Pulse[] = [];
  queue.push({ type: "low", destination: "broadcaster", origin: "button" });

  while (queue.length > 0) {
    const pulse = queue.shift();
    // console.log(`${pulse.origin} -${pulse.type}-> ${pulse.destination}`);
    if (pulse.type === targetPulseType && pulse.origin === targetPulseOrigin) {
      return true;
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
  return [...state.entries()].map((e) => `${e[0]}:${e[1]}`).join(",");
};

const resetState = (
  modules: Map<string, Module>
): {
  flipFlopOn: Map<string, boolean>;
  conjuctionLastInputs: Map<string, Map<string, PulseType>>;
} => {
  const flipFlopOn = new Map<string, boolean>();
  const conjuctionLastInputs = new Map<string, Map<string, PulseType>>();

  for (const module of modules.values()) {
    if (module.type === "flip-flop") {
      flipFlopOn.set(module.name, false);
    }
    if (module.type === "conjunction") {
      conjuctionLastInputs.set(module.name, new Map());
    }
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

  return {
    flipFlopOn,
    conjuctionLastInputs,
  };
};

const getOrigins = (modules: Map<string, Module>, name: string): Module[] => {
  const origins: Module[] = [];
  for (const module of modules.values()) {
    if (module.destinations.includes(name)) {
      origins.push(module);
    }
  }
  return origins;
};

const getPressesUntil = (
  modules: Map<string, Module>,
  targetPulseType: PulseType,
  targetPulseOrigin: string
): number => {
  console.log(targetPulseOrigin, targetPulseType);
  const module = modules.get(targetPulseOrigin);
  if (module.type === "conjunction") {
    if (targetPulseType === "low") {
      return getOrigins(modules, module.name)
        .map((o) => getPressesUntil(modules, "high", o.name))
        .reduce((a, b) => lcm(a, b), 1);
    }
  }

  const { conjuctionLastInputs, flipFlopOn } = resetState(modules);
  let presses = 0;
  let receivedTargetPulse = false;
  while (!receivedTargetPulse) {
    presses += 1;
    receivedTargetPulse = pressButton(
      modules,
      flipFlopOn,
      conjuctionLastInputs,
      targetPulseType,
      targetPulseOrigin
    );
  }
  return presses;
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

  for (const line of lines) {
    const module = parseModule(line);
    modules.set(module.name, module);
  }

  const TARGET_MODULE = "rx";
  const TARGET_PULSE_TYPE = "low";

  const origins = getOrigins(modules, TARGET_MODULE);
  let minPresses = Number.MAX_VALUE;
  for (const origin of origins) {
    const presses = getPressesUntil(modules, TARGET_PULSE_TYPE, origin.name);
    minPresses = Math.min(minPresses, presses);
  }

  console.log(minPresses);

  // let result = getPressesUntil(modules, "high", "dh");
  // console.log(result);
  // result = getPressesUntil(modules, "high", "qd");
  // console.log(result);
  // result = getPressesUntil(modules, "high", "bb");
  // console.log(result);
  // result = getPressesUntil(modules, "high", "dp");
  // console.log(result);
  // let result = getPressesUntil(modules, "low", "dt");
  // console.log(result);
};

run();

// const l = [3877, 4001, 3907, 4027].reduce((a, b) => lcm(a,b), 1)
// console.log(l)
