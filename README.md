# USDC

https://www.circle.com/en/multichain-usdc

USDC is available on many of the world's leading blockchains, with more chain integrations expected.

- [ETHEREUM USDC](https://www.circle.com/en/usdc-multichain/ethereum)
- [ALGORAND USDC](https://www.circle.com/en/usdc-multichain/algorand)
- [SOLANA USDC](https://www.circle.com/en/usdc-multichain/solana)
- [STELLAR USDC](https://www.circle.com/en/usdc-multichain/stellar)
- [TRON USDC](https://www.circle.com/en/usdc-multichain/tron)
- [HEDERA USDC](https://www.circle.com/en/usdc-multichain/hedera)
- [AVALANCHE USDC](https://www.circle.com/en/usdc-multichain/avalanche)
- [FLOW USDC](https://www.circle.com/en/usdc-multichain/flow)
- [POLYGON USDC](https://www.circle.com/en/usdc-multichain/polygon)

### Installation

```
npm install --save usdc

```

### Example Usage

##### Stellar

```
import { stellar } from 'usdc'

stellar.getUSDCBalance({ address: process.env.stellar_usdc_address })
	.then(console.log)
  
const { txid } = await stellar.sendUSDCPayment({
  mnemonic: process.env.stellar_usdc_mnemonic,
  to: [{
    address: process.env.stellar_usdc_address,
    amount: 1
  }]
})

stellar.checkPaymentStatus({ txid }).then(console.log)


```

##### Ethereum

```
import { ethereum } from 'usdc'

ethereum({ address: process.env.ethereum_usdc_address })
	.then(console.log)
  
const { txid } = await ethereum.sendUSDCPayment({
  mnemonic: process.env.ethereum_usdc_mnemonic,
  to: [{
    address: process.env.ethereum_usdc_address,
    amount: 1
  }]
})

ethereum.checkPaymentStatus({ txid }).then(console.log)

```

##### Polygon

```
import { polygon } from 'usdc'

polygon({ address: process.env.polygon_usdc_address })
	.then(console.log)

const { txid } = await polygon.sendUSDCPayment({
  mnemonic: process.env.polygon_usdc_mnemonic,
  to: [{
    address: process.env.polygon_usdc_address,
    amount: 1
  }]
})

polygon.checkPaymentStatus({ txid }).then(console.log)

```

##### Hedera

```
import { hedera } from 'usdc'

hedera({ address: process.env.hedera_usdc_address })
	.then(console.log)

const { txid } = await hedera.sendUSDCPayment({
  mnemonic: process.env.hedera_usdc_mnemonic,
  to: [{
    address: process.env.hedera_usdc_address,
    amount: 1
  }]
})

hedera.checkPaymentStatus({ txid }).then(console.log)

```

##### Avalanche

```
import { avalanche } from 'usdc'

avalanche({ address: process.env.avalanche_usdc_address })
	.then(console.log)

const { txid } = await avalanche.sendUSDCPayment({
  mnemonic: process.env.avalanche_usdc_mnemonic,
  to: [{
    address: process.env.avalanche_usdc_address,
    amount: 1
  }]
})

avalanche.checkPaymentStatus({ txid }).then(console.log)

```

##### Solana

```
import { solana } from 'usdc'

solana({ address: process.env.solana_usdc_address })
	.then(console.log)

const { txid } = await solana.sendUSDCPayment({
  mnemonic: process.env.solana_usdc_mnemonic,
  to: [{
    address: process.env.solana_usdc_address,
    amount: 1
  }]
})

solana.checkPaymentStatus({ txid }).then(console.log)

```

##### Tron

```
import { tron } from 'usdc'

tron({ address: process.env.tron_usdc_address })
	.then(console.log)

const { txid } = await tron.sendUSDCPayment({
  mnemonic: process.env.tron_usdc_mnemonic,
  to: [{
    address: process.env.tron_usdc_address,
    amount: 1
  }]
})

tron.checkPaymentStatus({ txid }).then(console.log)

```

##### Flow

```
import { flow } from 'usdc'

flow({ address: process.env.flow_usdc_address })
	.then(console.log)

const { txid } = await flow.sendUSDCPayment({
  mnemonic: process.env.flow_usdc_mnemonic,
  to: [{
    address: process.env.flow_usdc_address,
    amount: 1
  }]
})

flow.checkPaymentStatus({ txid }).then(console.log)

```

##### Algorand

```
import { algorand } from 'usdc'

algorand({ address: process.env.algorand_usdc_address })
	.then(console.log)

const { txid } = await algorand.sendUSDCPayment({
  mnemonic: process.env.algorand_usdc_mnemonic,
  to: [{
    address: process.env.algorand_usdc_address,
    amount: 1
  }]
})

algorand.checkPaymentStatus({ txid }).then(console.log)

```
