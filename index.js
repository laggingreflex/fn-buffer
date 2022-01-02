// const debug = (...m) => console.log('[fn-buffer]', ...m);

export default class BufferedFunction extends Function {
  /**
   * Buffer function calls till you flush
   * @param {function} fn The function to buffer calls of
   * @param {object} [opts]
   * @param {number} [opts.capacity=10] Capacity of the ring-buffer of the calls
   * @param {number} [opts.flush=capacity] Auto-flush when buffer gets full. Set 0 to disable
   * @param {boolean} [opts.reverse] Reverse the order of buffer calls
   * @returns {apply} A function that pushes its call state into the buffer
   */
  constructor(fn, opts) {
    super();
    if (typeof opts === 'number') opts = { capacity: opts };
    this.opts = opts;
    this.queue = this.opts?.queue ?? new BufferQueue(this.opts?.capacity || 10);
    this.fn = fn;
    const name = ['patched(fn-buffer)', this.fn.name].filter(Boolean).join('<=');
    Object.defineProperty(this, 'name', { value: name });
    /** @type {apply} */
    return new Proxy(this, { apply: this.apply });
  }
  /** @type {apply} */
  apply = (target, thisArgument, argumentsList) => {
    this.queue.push([ /* not target */ this.fn, thisArgument, argumentsList]);
    if (this.queue.isFull) this.flush(this.opts?.flush);
  }
  flush = (length = this.queue.capacity) => {
    if (!length) return;
    let flushed = this.queue.flush();
    if (this.opts?.reverse) flushed.reverse();
    if (typeof length === 'number') flushed = flushed.slice(0, length);
    if (!flushed.length) return;
    // debug?.(`Skipping ${this.queue.total} calls`);
    // debug?.(`Flushing last ${flushed.length}/${this.queue.total} calls`);
    return flushed.map(([target = this.fn, thisArgument, argumentsList]) => {
      return Reflect.apply(target, thisArgument, argumentsList);
    });
  }
}

/**
 * @typedef {function} apply Pushes call state to buffer. Arguments will be passed to Reflect.apply
 * @param target
 * @param this
 * @param arguments
 */


export class BufferQueue extends Array {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    super();
    this.capacity = capacity;
    this.total = 0;
  }

  push = (...args) => {
    super.push(...args);
    if (this.isFull) {
      this.splice(0, this.length - this.capacity);
      this.total += this.length;
    }
  }

  get isFull() {
    return this.length >= this.capacity;
  }

  /**
   * Empties the queue and returns a copy
   */
  flush = () => {
    return this.splice(0, this.length);
  }
}
