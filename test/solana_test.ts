
import { expect } from './utils'

import * as usdc from '../src'

const mnemonic = 'street neglect reform tissue into chef coyote kit crop gun nest now'

describe("Solana USDC", () => {

  describe("Loading USDC Wallet on Solana from Seed Phrase", () => {

    it('should return the wallet address given a mnemonic phrase', () => {

      const address = usdc.solana.getAddressFromMnemonic({ mnemonic })

      console.log(address)

      expect(address).to.be.a('string')

      expect(String(address).length).to.be.greaterThan(0)

    })

    it('should validate a wallet address', () => {

      const address = usdc.solana.getAddressFromMnemonic({ mnemonic })

      const isValid = usdc.solana.isAddress({ address })

      expect(isValid).to.be.equal(true)

      const invalidIsValid = usdc.solana.isAddress({ address: '12345' })

      expect(invalidIsValid).to.be.equal(false)

    })

  })

  describe("Getting Solana Wallet Balances", async () => {

    it('should get the USDC wallet balance as zero for an empty wallet', async () => {

      try {

        const address = usdc.solana.getAddressFromMnemonic({ mnemonic })

        const balance = await usdc.solana.getUSDCBalance({ address })

        expect(balance).to.be.equal(0)

      } catch(error) {

        console.error(error)

      }

    })

    it('should get the USDC wallet balance for a non-empty wallet', async () => {

      const address = 'GeKcUd7Ftqhyyvf2zE9JNx5bud5N7QvUBnBQkYWwRnHg'

      const balance = await usdc.solana.getUSDCBalance({ address })

      console.log({ balance, address })

      expect(balance).to.be.greaterThan(0)

    })

    it('should get the SOL wallet balance for a non-empty wallet', async () => {

      const address = 'GeKcUd7Ftqhyyvf2zE9JNx5bud5N7QvUBnBQkYWwRnHg'

      const balance = await usdc.solana.getGasBalance({ address })

      console.log({ balance, address })

      expect(balance).to.be.greaterThan(0)

    })

  })

  describe("Parsing & Validating Solana Transactions", () => {

    it("#parseUSDCTransaction should parse a USDC transaction", async () => {

      const payment = await usdc.solana.parseUSDCTransaction({ txhex: usdc.solana.vectors.SPL_USDC_TRANSFER_HEX })


      //expect(payment.transaction.serialize.toString('hex')).to.be.equal(usdc.solana.vectors.SPL_USDC_TRANSFER_HEX)

      console.log(payment.outputs)

    })

    it("#parseUSDCTransaction should parse a USDC transaction", async () => {

      const payment = await usdc.solana.parseUSDCTransaction({ txhex: usdc.solana.vectors.SPL_USDC_TRANSFER_HEX })

      expect(payment.outputs[0].amount).to.be.equal(0.01)
      expect(payment.outputs[0].address).to.be.equal('Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB')

      expect(payment.outputs[1].amount).to.be.equal(0.01)
      expect(payment.outputs[1].address).to.be.equal('Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB')

    })

    it('#validatePayment should validate the correct outputs of USDC transaction', async () => {

      const payment = await usdc.solana.parseUSDCTransaction({ txhex: usdc.solana.vectors.SPL_USDC_TRANSFER_HEX })

      const isValid = usdc.solana.validatePayment({
        txhex: usdc.solana.vectors.SPL_USDC_TRANSFER_HEX,
        outputs: [{
          address: 'Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB',
          amount: 0.01
        }]
      })

      expect(isValid).to.be.equal(true)
      
      try {

        usdc.solana.validatePayment({
          txhex: usdc.solana.vectors.SPL_USDC_TRANSFER_HEX,
          outputs: [{
            address: 'Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB',
            amount: 1
          }]
        })

        expect(false) // fail -- it should not ever get here

      } catch(error) {

        console.error(error)

      }

    })

    it.skip('#validatePayment should allow for some unique identitifer and reject if not present', async () => {

    })

  })

  describe("Creating Payment Requests for Solana", () => {

  })

  describe("Creating & Signing Solana Payments", () => {

    it('should build a multi-output USDC signed payment hex', async () => {

      const address = usdc.solana.getAddressFromMnemonic({ mnemonic })

      const txhex = await usdc.solana.buildPayment({
        mnemonic,
        to: [{
          address: 'Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB',
          amount: 0.01
        }, {
          address: 'Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB',
          amount: 0.02
        }]
      })

      console.log({ txhex })

      expect(txhex).to.be.a('string')

    })
  })

})
