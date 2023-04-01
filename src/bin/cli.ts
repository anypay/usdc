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
          
          amount: parseFloat(amount),

          transmit: true

        })
  
        console.log(result)

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

