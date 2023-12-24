import * as fs from "fs/promises";

type UnconditionalRule = {
  type: 'unconditional';
  destination: string;
}

type ConditionalRule = {
  type: 'conditional';
  destination: string;
  category: string;
  operator: string;
  value: number;
}

type Rule = UnconditionalRule | ConditionalRule;

type Workflow = {
  name: string;
  rules: Rule[];
}

type Part = {
  x: number,
  m: number,
  a: number,
  s: number,
}

const parseRule = (s: string): Rule => {
  const match = s.match(/(.*)([<>])(\d*):(.*)/)
  if (!match) {
    return {
      type: "unconditional",
      destination: s,
    }
  }
  return {
    type: "conditional",
    category: match[1],
    operator: match[2],
    value: Number.parseInt(match[3]),
    destination: match[4],
  }
}

const parseWorkflow = (s: string): Workflow => {
  const match = s.match(/(.*){(.*)}/)
  const name = match[1];
  const rules = match[2].split(',').map(s => parseRule(s))
  return {
    name,
    rules,
  }
}

const parsePart = (s: string):  Part => {
  const match = s.match(/{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/)
  return {
    x: Number.parseInt(match[1]),
    m: Number.parseInt(match[2]),
    a: Number.parseInt(match[3]),
    s: Number.parseInt(match[4]),
  }
}

const meetsCondition = (rule: ConditionalRule, part: Part): boolean => {
  let value = part[rule.category] as number;
  if (rule.operator === '<') {
    return value < rule.value;
  } else if (rule.operator === '>') {
    return value > rule.value;
  }
  return false;
}

const getNextWorkflow = (workflows: Map<string, Workflow>, part: Part, current: string): string => {
  const workflow = workflows.get(current);
  for (const rule of workflow.rules) {
    if (rule.type === 'unconditional') {
      return rule.destination;
    }
    if (meetsCondition(rule, part)) {
      return rule.destination;
    }
  }
}

const isAccepted = (workflows: Map<string, Workflow>, part: Part): boolean => {
  let workflow = 'in';
  while(workflow !== 'A' && workflow !== 'R') {
    workflow = getNextWorkflow(workflows, part, workflow);
  }
  return workflow === 'A';
}

const run = async () => {
  // const content = await fs.readFile("day19/test-input.txt", {
  //   encoding: "utf8",
  // });
  const content = await fs.readFile("day19/input.txt", { encoding: "utf8" });
  const lines = content.split("\n");

  const workflows = new Map<string, Workflow>();
  let i = 0;
  while (i < lines.length && lines[i] !== "") {
    const workflow = parseWorkflow(lines[i]);
    workflows.set(workflow.name, workflow);
    i += 1;
  }
  i += 1;

  let sum = 0;
  while (i < lines.length) {
    const part = parsePart(lines[i]);
    if(isAccepted(workflows, part)) {
      sum += part.x + part.m + part.a + part.s;
    }
    i += 1;
  }
  console.log(sum);
};

run();

