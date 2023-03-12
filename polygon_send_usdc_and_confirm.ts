require('dotenv').config()

import * as usdc from './src'

import delay from 'delay'

(async () => {

      const {txhex, txid, transmitResult} = await usdc.polygon.buildUSDCTransfer({
        mnemonic: process.env.mnemonic,
        amount: 1,
        to: '0xA77547a3fB82a5Fa4DB408144870B69c70906989',
        transmit: true
      })

      console.log("RESULT", { txhex, txid, transmitResult})

      var confirmed = false

      while (!confirmed) {

        const { confirmations, block_hash, block_number } = await usdc.polygon.getConfirmations({ txhash: txid })

        if (confirmations > 0) {

          console.log("confirmed!", {
            confirmations, block_hash, block_number
          })

          confirmed = true

        }

        await delay(1000)

      }

})();

