import * as fs from "fs/promises";

type UnconditionalRule = {
  type: "unconditional";
  destination: string;
};

const categories = ["x", "m", "a", "s"] as const;
type Category = (typeof categories)[number];

type ConditionalRule = {
  type: "conditional";
  destination: string;
  category: Category;
  operator: string;
  value: number;
};

type Rule = UnconditionalRule | ConditionalRule;

type Workflow = {
  name: string;
  rules: Rule[];
};

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Segment = {
  start: number;
  len: number;
};

type Block = {
  x: Segment[];
  m: Segment[];
  a: Segment[];
  s: Segment[];
};

const parseRule = (s: string): Rule => {
  const match = s.match(/(.*)([<>])(\d*):(.*)/);
  if (!match) {
    return {
      type: "unconditional",
      destination: s,
    };
  }
  return {
    type: "conditional",
    category: match[1] as Category,
    operator: match[2],
    value: Number.parseInt(match[3]),
    destination: match[4],
  };
};

const parseWorkflow = (s: string): Workflow => {
  const match = s.match(/(.*){(.*)}/);
  const name = match[1];
  const rules = match[2].split(",").map((s) => parseRule(s));
  return {
    name,
    rules,
  };
};

const parsePart = (s: string): Part => {
  const match = s.match(/{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/);
  return {
    x: Number.parseInt(match[1]),
    m: Number.parseInt(match[2]),
    a: Number.parseInt(match[3]),
    s: Number.parseInt(match[4]),
  };
};

const meetsCondition = (rule: ConditionalRule, part: Part): boolean => {
  let value = part[rule.category] as number;
  if (rule.operator === "<") {
    return value < rule.value;
  } else if (rule.operator === ">") {
    return value > rule.value;
  }
  return false;
};

const getNextWorkflow = (
  workflows: Map<string, Workflow>,
  part: Part,
  current: string
): string => {
  const workflow = workflows.get(current);
  for (const rule of workflow.rules) {
    if (rule.type === "unconditional") {
      return rule.destination;
    }
    if (meetsCondition(rule, part)) {
      return rule.destination;
    }
  }
};

const isAccepted = (workflows: Map<string, Workflow>, part: Part): boolean => {
  let workflow = "in";
  while (workflow !== "A" && workflow !== "R") {
    workflow = getNextWorkflow(workflows, part, workflow);
  }
  return workflow === "A";
};

const getCombinations = (block: Block) => {
  let prouct = 1;
  for (const key of categories) {
    let sum = 0;
    const segments = block[key];
    for (const segment of segments) {
      sum += segment.len;
    }
    prouct *= sum;
  }
  return prouct;
};

const splitSegments = (
  segments: Segment[],
  split: number
): { before: Segment[]; after: Segment[] } => {
  const before: Segment[] = [];
  const after: Segment[] = [];

  let i = 0;
  while (i < segments.length && segments[i].start + segments[i].len <= split) {
    before.push(segments[i]);
    i += 1;
  }
  if (i < segments.length) {
    if (segments[i].start < split) {
      before.push({ start: segments[i].start, len: split - segments[i].start });
    }
    if (segments[i].start + segments[i].len > split) {
      after.push({
        start: split,
        len: segments[i].start + segments[i].len - split,
      });
    }
  }
  i += 1;
  while (i < segments.length) {
    after.push(segments[i]);
    i += 1;
  }

  return { before, after };
};

const splitBlock = (
  block: Block,
  rule: ConditionalRule
): { matching: Block; nonMatching: Block } => {
  const split = rule.operator === "<" ? rule.value : rule.value + 1;
  const segments = block[rule.category];
  const { before, after } = splitSegments(segments, split);
  const [matchingSegments, nonMatchingSegments] =
    rule.operator === "<" ? [before, after] : [after, before];
  return {
    matching: {
      ...block,
      [rule.category]: matchingSegments,
    },
    nonMatching: {
      ...block,
      [rule.category]: nonMatchingSegments,
    },
  };
};

const getAccepted = (
  workflows: Map<string, Workflow>,
  block: Block,
  current: string
): number => {
  if (current === "R") {
    return 0;
  }
  if (current === "A") {
    return getCombinations(block);
  }

  let accepted = 0;
  const workflow = workflows.get(current);
  let remaining = block;

  for (const rule of workflow.rules) {
    if (rule.type === "unconditional") {
      accepted += getAccepted(workflows, remaining, rule.destination);
    } else {
      const { matching, nonMatching } = splitBlock(remaining, rule);
      accepted += getAccepted(workflows, matching, rule.destination )
      remaining = nonMatching;
    }
  }

  return accepted;
};

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

  const block: Block = {
    x: [{ start: 1, len: 4000 }],
    m: [{ start: 1, len: 4000 }],
    a: [{ start: 1, len: 4000 }],
    s: [{ start: 1, len: 4000 }],
  };

  const result = getAccepted(workflows, block, "in");
  console.log(result);
};

run();