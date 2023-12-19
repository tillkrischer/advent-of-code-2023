import * as fs from 'fs/promises'

const getDiffs = (nums: number[]) => {
    const diffs: number[] = [];
    for (let i = 0; i < nums.length - 1; i++) {
        const d = nums[i+1] - nums[i];
        diffs.push(d);
    }
    return diffs;
}

const extrapolate = (nums: number[]) => {
    const layers: number[][] = [];
    layers.push(nums);
    while (!layers.at(-1).every(n => n === 0)) {
       const diffs = getDiffs(layers.at(-1));
       layers.push(diffs)
    }
    for (let i = layers.length - 2; i >= 0; i -= 1 ) {
        const lastDiff = layers[i+1].at(0);
        const newValue = layers[i].at(0) - lastDiff;
        layers[i].unshift(newValue);
    }
    return layers[0].at(0);
}

const run = async () => {
    // const content = await fs.readFile('day9/test-input.txt', { encoding: 'utf8' });
    const content = await fs.readFile('day9/input.txt', {encoding: 'utf8'});
    const lines = content.split('\n');

    let sum = 0;
    for (const line of lines) {
        const nums = line.split(/\s+/).map(c => Number.parseInt(c))
        const prediction = extrapolate(nums);
        sum += prediction;
    }
    console.log(sum);
}

run()
