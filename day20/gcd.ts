const gcd = (a: number, b: number) => {
    if (a === b) {
        return a;
    }
    const larger = a > b ? a : b;
    const smaller = a > b ? b : a;
    return gcd(larger - smaller, smaller)
}

const lcm = (a: number, b: number) => {
    const num = Math.abs(a * b);
    const denom = gcd(a, b);
    return num / denom;
}

const gcdMultiple = (array: number[]) => {
   array.reduce((a, b) => gcd(a, b), 1)
}

const lcmMultiple = (array: number[]) => {
    array.reduce((a, b) => lcm(a, b), 1)
}
