import assert from 'assert';
import BufferedFunction from './index.js';

describe('basic', () => {
  it('should work', () => {
    const { calls, fn } = spy();
    const bufferedLog = new BufferedFunction(fn);

    bufferedLog('a')
    bufferedLog('b')
    bufferedLog('c')
    bufferedLog('d')
    bufferedLog('e')
    assert.equal(calls.length, 0);
    bufferedLog.flush();
    assert.equal(calls.length, 5);
  });
})

describe('auto-flush', () => {
  it('should work', () => {
    const { calls, fn } = spy();
    const bufferedLog = new BufferedFunction(fn);

    bufferedLog('1')
    bufferedLog('2')
    bufferedLog('3')
    bufferedLog('4')
    bufferedLog('5')
    bufferedLog('6')
    bufferedLog('7')
    bufferedLog('8')
    bufferedLog('9')
    assert.equal(calls.length, 0);
    bufferedLog('10')
    assert.equal(calls.length, 10);
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
