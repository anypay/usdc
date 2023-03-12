
import alchemy from './alchemy'

const txid = process.argv[2]

alchemy.core
  .getTransaction(
    process.argv[2]
  )
  .then(console.log);

