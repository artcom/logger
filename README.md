# Logger

A [Winston](https://github.com/winstonjs/winston) logger which logs to JSON with ordered keys and error stack support.

# Usage

Install this library via npm:
```bash
npm install @artcom/logger
```

Use as follows:
```javascript
const { createLogger } = require("@artcom/logger")
const logger = createLogger()

logger.info("Hello world!")
```

Additional options are supported:
* `transports`: is the array of transports managed by [Winston](https://github.com/winstonjs/winston)
* `keyOrder` is the array specifying the order of message keys (e.g. ["timestamp", "level", "message"]), additional keys are placed after these keys by insertion order
