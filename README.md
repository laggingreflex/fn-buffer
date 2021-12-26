# fn-buffer

Make your function buffer calls till you flush.

Useful to make [Backtrace logging](#backtrace-logging).

## Install

```sh
npm install fn-buffer
```

## API

```js
buffer(fn, opts)
```

* **`fn`** `<function>(required)` The function to buffer calls of
* **`opts`** `[number|object]` Options or `capacity`
* **`opts.capacity`** `[number=10]` Capacity of the ring-buffer of the calls
* **`opts.reverse`** `[boolean]` Reverse the order of buffer calls

## Example

```js
import buffer from 'fn-buffer'

const bufferedLog = buffer(console.log);

bufferedLog('a')
bufferedLog('b')
bufferedLog('c')
bufferedLog('d')
bufferedLog('e')
/* Doesn't log anything yet */

bufferedLog.flush();
/* Logs everything at once */
```

### [**Backtrace logging**](http://www.exampler.com/writing/ring-buffer.pdf)

```js
import buffer from 'fn-buffer'

const debug = buffer(console.debug)
process.on('uncaughtExceptionMonitor', debug.flush)
```

This `debug` will only log to console in the event of an `uncaughtException`.
