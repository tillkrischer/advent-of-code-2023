type KeyFunction<T> = (x: T) => string;

export class KeyedSet<T> {
  private _map: Map<string, T>;
  private _keyFunc: KeyFunction<T>;

  constructor(f: KeyFunction<T>) {
    this._map = new Map<string, T>();
    this._keyFunc = f;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  add(x: T): void {
    const key = this._keyFunc(x);
    this._map.set(key, x);
  }

  has(x: T): boolean {
    const key = this._keyFunc(x);
    return this._map.has(key);
  }

  size(): number {
    return this._map.size;
  }

  values() {
    return this._map.values();
  }

  union(b: KeyedSet<T>): KeyedSet<T> {
    const union = new KeyedSet<T>(this._keyFunc);
    for (const t of this) {
      union.add(t);
    }
    for (const t of b) {
      union.add(t);
    }
    return union;
  }
}



// const a = new KeyedSet<number>(a => a.toString());

// a.add(1)
// a.add(1)
// a.add(2)
// a.add(3)

// for (const e of a) {
//     console.log(e)
// }