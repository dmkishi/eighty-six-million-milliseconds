import { int2ja } from 'int2words';

export default class Time {
  #maxMs = 24 * 60 * 60 * 1_000;
  #baseMs: number;

  constructor() {
    this.#baseMs = this.#getBaseMs();
  }

  toString(): string {
    return int2ja(this.#elapsedMs());
  }

  #getBaseMs(): number {
    const now = new Date();
    const baseDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0 ,0);
    return baseDateTime.valueOf();
  }

  #elapsedMs(): number {
    const now = new Date().valueOf();
    if (now > this.#maxMs) {
      this.#baseMs = this.#getBaseMs();
    }
    return now - this.#baseMs;
  }
}
