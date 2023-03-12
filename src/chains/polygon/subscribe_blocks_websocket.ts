require('dotenv').config()

import alchemy from './alchemy'

// Subscribe to new blocks, or newHeads
alchemy.ws.on("block", (blockNumber) =>
  console.log("Latest block:", blockNumber)
);
