# fn-buffer

Make your function buffer calls till you flush.

Useful to make [Backtrace logging](#backtrace-logging).

## Install

```sh
npm install fn-buffer
```

## API

```js
new BufferedFunction(fn, opts)
```

* **`fn`** `<function>(required)` The function to buffer calls of
* **`opts`** `[number|object]` Options or `capacity`
* **`opts.capacity`** `[number=10]` Capacity of the ring-buffer of the calls
* **`opts.flush`** `[number=capacity]` Auto-flush when buffer gets full
* **`opts.reverse`** `[boolean]` Reverse the order of buffer calls

## Example

```js
import BufferedFunction from 'fn-buffer'

const bufferedLog = new BufferedFunction(console.log);

bufferedLog('a')
bufferedLog('b')
bufferedLog('c')
bufferedLog('d')
bufferedLog('e')
/* Doesn't log anything yet */

bufferedLog.flush();
/* Logs everything at once */
```

### Backtrace logging

This can be used to create [backtrace-logging](http://www.exampler.com/writing/ring-buffer.pdf):

```js
import BufferedFunction from 'fn-buffer'

export const debug = new BufferedFunction(console.debug, { flush: 0 })
process.on('uncaughtExceptionMonitor', debug.flush)
```

This `debug` function will only log to console in the event of an `uncaughtException`.

See [**backtrace-logging**](https://github.com/laggingreflex/backtrace-logging) for a module that does exactly this.
