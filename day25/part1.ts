import * as fs from "fs/promises";

const contract  = (edges: number[][], bin: boolean[]): {s: number, t: number, mincut: number} => {
    const n = edges.length;
    const dist: number[] = new Array(n).fill(0);
    const vis: boolean[] = new Array(n).fill(false);
    let mincut = 0;
    let s = 0;
    let t = 0;
    for (let i = 0; i < n ; i++) {
        let k = -1;
        let maxc = -1;
        for (let j = 0; j < n; j++) {
            if (!bin[j] && !vis[j] && dist[j] > maxc) {
                k = j;
                maxc = dist[j];
            }
        }
        if (k === -1) {
            return {s, t, mincut}
        }
        s = t;
        t = k;
        mincut = maxc;
        vis[k] = true;
        for (let j = 0; j < n; j++) {
            if (!bin[j] && !vis[j]) {
                dist[j] += edges[k][j]
            }
        }
    }
    return {s, t, mincut}
}

const globalMinCut = (edges: number[][]) => {
    const edge = edges.map(r => r.slice());

    let mincut = Number.MAX_VALUE;
    let mincutS = -1;
    let mincutT = -1;
    const n = edge.length;
    const bin = new Array(n).fill(false);
    for (let i = 1; i < n; i++) {
        const {mincut: ans, s, t}  = contract(edge, bin);
        bin[t] = true;
        if (mincut > ans) {
            mincut = ans;
            mincutS = s;
            mincutT = t;
        }
        if (mincut === 0) {
            return {mincut, mincutS, mincutT};
        }
        for (let j = 0; j < n; j++) {
            if (!bin[j])  {
                edge[s][j] += edge[j][t];
                edge[j][s] += edge[j][t];
            }
        }
    }
    return {mincut, mincutS, mincutT};
}

type Edge = {
    s: number,
    t: number,
    cap: number,
    flow: number,
}

const maxFlow = (edges: number[][], s: number, t: number) => {
    const n = edges.length;
    const graph: Edge[][] = new Array(n)
        .fill(false).map(_ => new Array(n));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            graph[i][j] = {
                s: i,
                t: j,
                cap: edges[i][j],
                flow: 0
            }
        }
    }

    let pred = new Array<Edge|null>(n).fill(null);
    let flow = 0;
    let path: Edge[] = [];
    do {
        const q: number[] = [];
        q.push(s);
        pred = new Array<Edge|null>(n).fill(null);
        while (q.length > 0 && pred[t] === null)  {
            const cur = q.pop();
            for (const e of graph[cur]) {
                if (pred[e.t] === null && e.t !== s && e.cap > e.flow) {
                    pred[e.t] = e;
                    q.push(e.t)
                }
            }
        }
        if (pred[t] !== null) {
            let df = Number.MAX_VALUE;
            path = [];
            for (let e = pred[t]; e !== null; e = pred[e.s]) {
                df = Math.min(df, e.cap - e.flow);
                path.push(e);
            }
            for (let e = pred[t]; e !== null; e = pred[e.s]) {
                e.flow += df;
                graph[e.t][e.s].flow -= df;
            }
            flow += df;
        }
    } while (pred[t] !== null);
    return {flow, path};
}

const removeEdge = (edges: number[][], s: number, t: number) => {
    const {flow, path} = maxFlow(edges, s, t);
    for (const edge of path) {
        edges[edge.s][edge.t] = 0;
        edges[edge.t][edge.s] = 0;
        const {flow: cutFlow} = maxFlow(edges, s, t);
        if (cutFlow < flow) {
            return;
        }
        edges[edge.s][edge.t] = 1;
        edges[edge.t][edge.s] = 1;
    }
}

const countConnected = (edges: number[][], visited: boolean[], s: number): number => {
    visited[s] = true;
    let count = 1;
    for (let i = 0; i < edges.length; i++) {
        if (edges[s][i] > 0 && !visited[i])  {
            count += countConnected(edges, visited, i);
        }
    }
    return count;
}

const run = async () => {
    // const content = await fs.readFile("day25/test-input.txt", {
    //     encoding: "utf8",
    // });
    // const content = await fs.readFile("day25/test-input2.txt", {
    //     encoding: "utf8",
    // });
    const content = await fs.readFile("day25/input.txt", { encoding: "utf8" });
    const lines = content.split("\n");

    const ids = new Map<string, number>();

    let n = 0;
    for (const line of lines) {
        const split = line.trim().split(/:?\s/);
        for (const vertex of split) {
            if (!ids.has(vertex)) {
                ids.set(vertex, n);
                n += 1;
            }
        }
    }

    const edges: number[][] = new Array(n).fill(false).map(_ => new Array(n).fill(0));

    for (const line of lines) {
        const split = line.trim().split(/:?\s/);
        const startId = ids.get(split[0])
        for (const dest of split.slice(1)) {
            const destId = ids.get(dest);
            edges[startId][destId] = 1;
            edges[destId][startId] = 1;
        }
    }

    const {mincutS, mincutT} = globalMinCut(edges);

    const s = mincutS;
    const t = mincutT;


    removeEdge(edges, s, t);
    removeEdge(edges, s, t);
    removeEdge(edges, s, t);

    let visited =  new Array(n).fill(false);
    const sCount = countConnected(edges, visited, s);
    visited =  new Array(n).fill(false);
    const tCount = countConnected(edges, visited, t);
    const product = sCount * tCount;
    console.log(product);
};

run();
