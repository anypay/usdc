#!/usr/bin/env ts-node
require('dotenv').config()

import { Command } from 'commander'

import read from 'read'

const program = new Command()

import { polygon } from '../../src'

import axios from 'axios'

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

        })
  
        console.log(result)

        const receipt = await polygon.broadcastSignedTransaction({ txhex: result.txhex })

        console.log('broadcast.receipt', receipt)

        const output = polygon.parseUSDCOutput({ transactionHex: result.txhex })

        console.log(output)

        console.log(`${output.amount / 1_000_000} USDC sent to ${output.address} on Polygon`)

        console.log(`Txid: ${result.txid}`)

        let confirmed = false

        console.log('Confirming...')

        while (!confirmed) {

          const { block_hash, confirmations } = await polygon.getConfirmations({ txhash: result.txid })

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
  .action(async (chain, url) => {

    var mnemonic = process.env.mnemonic

    if (!mnemonic) {

      mnemonic = read({
        prompt: 'enter mnemonic seed phrase (hidden):',
        silent: true
      })

    }

    const { data } = await axios.post(url, {
      chain,
      currency: 'USDC'
    }, {
      headers: {
        'content-type': 'application/payment-request'
      }
    })

    console.log(data)

    const { address, amount } = data.instructions[0].outputs[0]

    const result = await polygon.buildUSDCTransfer({

      mnemonic,

      to: address,
      
      amount

    })

    console.log(result, 'buildUSDCTransfer.result')

    const { data: sendResult } = await axios.post(url, {
      chain,
      currency: 'USDC',
      transactions: [{
        tx: result.txhex
      }]
    }, {
      headers: {
        'content-type': 'application/payment'
      }
    })

    console.log(sendResult, 'anypay.payment.send.result')



  })


program.parse(process.argv)

