import assert from 'assert';
import buffer from './index.js';

describe('basic', () => {
  it('should work', () => {
    const { calls, fn } = spy();
    const bufferedLog = buffer(fn);

    bufferedLog('a')
    bufferedLog('b')
    bufferedLog('c')
    bufferedLog('d')
    bufferedLog('e')
    assert.equal(calls.length, 0);

    bufferedLog.flush();
    bufferedLog.flush()
    assert.equal(calls.length, 5);
    /* Logs everything at once */
  });
})

function spy(opts) {
  return Object.assign({
    calls: [],
    returns: () => {},
    get fn() {
      Object.defineProperty(this, 'fn', {
        value: (...args) => {
          this.calls.push(args);
          return this.returns();
        }
      });
      return this.fn;
    },
  }, opts);
}
