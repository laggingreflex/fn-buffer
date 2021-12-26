/**
 * Buffer function calls till you flush
 * @param {function} fn The function to buffer calls of
 * @param {object} [opts]
 * @param {number} [opts.capacity=10] Capacity of the ring-buffer of the calls
 * @param {boolean} [opts.reverse] Reverse the order of buffer calls
 * @returns {function} A function that pushes its arguments into the buffer
 */
export default function fnBuffer(fn, opts) {
  if (typeof opts === 'number') opts = { capacity: opts };
  const queue = new Queue(opts?.capacity || 10);
  /**
   * Pushes arguments into the buffer queue
   */
  const push = (...args) => {
    queue.push(args);
  }
  /**
   * Calls all previously buffered functions and returns an array of results
   */
  push.flush = () => {
    const flushed = queue.flush();
    if (opts?.reverse) flushed.reverse();
    return flushed.map(args => fn(...args));
  }
  return push;
}

/**
 * A makeshift ring-buffer data structure
 */
export class Queue extends Array {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    super();
    this.capacity = capacity;
  }

  push(...args) {
    super.push(...args);
    if (this.length > this.capacity) {
      this.splice(0, this.length - this.capacity);
    }
  }
  /**
   * Empties the queue and returns a copy
   */
  flush() {
    return this.splice(0, this.length);
  }
}