type ElementWithPriority<T> = {
  element: T;
  priority: number;
};

export class MinHeap<T> {
  private readonly _heap: ElementWithPriority<T>[];

  constructor() {
    this._heap = [];
  }

  public peek(): T {
    return this._heap[0].element;
  }

  public size(): number {
    return this._heap.length;
  }

  public enq(element: T, priority: number): number {
    const size = this._heap.push({ element, priority });
    let current = size - 1;

    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this._compare(current, parent) <= 0) break;
      this._swap(parent, current);
      current = parent;
    }
    return size;
  }

  public deq(): T {
    const first = this.peek();
    const last = this._heap.pop();
    const size = this.size();
    if (size === 0) {
      return first;
    }
    this._heap[0] = last;
    let current = 0;

    while (current < size) {
      let smallest = current;
      const left = (2 * current) + 1;
      const right = (2 * current) + 2;
      if (left < size && this._compare(left, smallest) >= 0) {
        smallest = left;
      }
      if (right < size && this._compare(right, smallest) >= 0) {
        smallest = right;
      }
      if (smallest === current) break;
      this._swap(smallest, current);
      current = smallest;
    }
    return first;
  }

  private _compare = (a: number, b: number): number => {
    return this._heap[b].priority - this._heap[a].priority;
}

  private _swap = (a: number, b: number) => {
    [this._heap[a], this._heap[b]] = [this._heap[b], this._heap[a]];
  };
}

