#!/usr/bin/env ts-node

import { Command } from 'commander'

import read from 'read'

const program = new Command()

import { polygon } from '../../src'

/*
 * > usdc-cli send MATIC $address 100
 *
 * `send` will get the private key mnemonic
 * phrase from the `mnemonic` environment
 * variable, the --mnemonic flag or prompt
 * the caller with a hidden type input.
 * 
 */
program
  .command('send <chain> <address> <amount>')
  .action(async (chain, address, amount) => {

    var mnemonic = process.env.mnemonic

    if (!mnemonic) {

      mnemonic = read({
        prompt: 'enter mnemonic seed phrase (hidden):',
        silent: true
      })

    }

    switch(chain) {

    case 'MATIC':

      try {

        const result = await polygon.buildUSDCTransfer({

          mnemonic,

          to: address,
          
          amount: parseFloat(amount) * 1_000_000, // 6 decimal places

          transmit: true

        })
  
        console.log(result)

        const output = polygon.parseUSDCOutput({ transactionHex: result.txhex })

        console.log(output)

        console.log(`${output.amount / 1_000_000} USDC sent to ${output.address} on Polygon`)

        console.log(`Txid: ${result.transmitResult.hash}`)

        let confirmed = false

        console.log('Confirming...')

        while (!confirmed) {

          const { block_hash, confirmations } = await polygon.getConfirmations({ txhash: result.transmitResult.hash })

          if (confirmations > 0) {

            confirmed = true

            console.log(`Transaction Confirmed in Block ${block_hash}`)

          }

        }

      } catch(error) {

        console.error(error)

      }

      break;

    default:

      console.log(`chain ${chain} not found`)

      break;
    }

    process.exit(0)

  })

/*
 * > usdc-cli pay MATIC $url
 *
 * `send` will get the private key mnemonic
 * phrase from the `mnemonic` environment
 * variable, the --mnemonic flag or prompt
 * the caller with a hidden type input.
 *
 */
program
  .command('pay <chain> <url>')
  .action(async (chain) => {


  })


program.parse(process.argv)

