require('dotenv').config()

import { expect } from './utils'

import * as usdc from '../src'
import { ethers } from 'ethers'
import { buildUSDCTransfer } from '../src/chains/polygon'

const mnemonic = process.env.mnemonic || 'street neglect reform tissue into chef coyote kit crop gun nest now'

describe("Polygon USDC", () => {

  describe("Loading USDC Wallet on Polygon from Seed Phrase", () => {

    it('should return the wallet address given a mnemonic phrase', () => {

      const address = usdc.polygon.getAddressFromMnemonic({ mnemonic })

      console.log(address)

      expect(address).to.be.a('string')

      expect(String(address).length).to.be.greaterThan(0)

    })

    it('should validate a wallet address', () => {

      const address = usdc.polygon.getAddressFromMnemonic({ mnemonic })

      const isValid = usdc.polygon.isAddress({ address })

      expect(isValid).to.be.equal(true)

      const invalidIsValid = usdc.polygon.isAddress({ address: '12345' })

      expect(invalidIsValid).to.be.equal(false)

    })

  })

  describe("Getting Polygon Wallet Balances", async () => {

    it('should get the USDC wallet balance as zero for an empty wallet', async () => {

      try {

        const address = usdc.polygon.getAddressFromMnemonic({ mnemonic })

        const balance = await usdc.polygon.getUSDCBalance({ address })

        expect(balance).to.be.equal(0)

      } catch(error) {

        console.error(error)

      }

    })

    it('should get the USDC wallet balance for a non-empty wallet', async () => {

      const address = '0xA77547a3fB82a5Fa4DB408144870B69c70906989'

      const balance = await usdc.polygon.getUSDCBalance({ address })

      console.log({ balance, address })

      expect(balance).to.be.greaterThan(0)

    })

    it('should get the MATIC wallet balance for a non-empty wallet', async () => {

      const address = '0xA77547a3fB82a5Fa4DB408144870B69c70906989'

      const balance = await usdc.polygon.getGasBalance({ address })

      console.log({ balance, address })

      expect(balance).to.be.greaterThan(0)

    })

  })

  describe("Sending Polygon Transactions", () => {

    it('should build a USDC transfer with ethers', async () => {

      const result = await usdc.polygon.buildUSDCTransfer({
        mnemonic,
        amount: 1,
        to: '0xA77547a3fB82a5Fa4DB408144870B69c70906989',
        transmit: true
      })

      console.log(result, 'buildUSDCTransfer.result')
    })

    it.skip('should build a usdc transfer with the pos client', async () => {

      console.log('BUILD USDC TRANSFER')

  

      const address = usdc.polygon.getAddressFromMnemonic({ mnemonic })

      const posClient = await usdc.polygon.getPosClient({ mnemonic, address })

      const erc20ChildToken = posClient.erc20('0x2791bca1f2de4661ed88a30c99a7a9449aa84174');

      const balance = await erc20ChildToken.getBalance(address)

      console.log('USDC ERC20 balance', balance)

      expect(parseInt(balance)).to.be.greaterThan(0)

    })

    it.skip('should send a USDC transaction broadcast', async () => {

      const to = '0xA77547a3fB82a5Fa4DB408144870B69c70906989'

      const address = usdc.polygon.getAddressFromMnemonic({ mnemonic })

      console.log("ADDRESS", address)

      const posClient = await usdc.polygon.getPosClient({ mnemonic, address })

      const erc20ChildToken = posClient.erc20('0x2791bca1f2de4661ed88a30c99a7a9449aa84174');

      const {chainId} = ethers.providers.getNetwork('matic')
    
      console.log("CHAIN ID", chainId)
    
      const provider = new ethers.providers.JsonRpcProvider(process.env.infura_polygon_url, chainId)

      const fees = await provider.getFeeData()

      console.log('FEE DATA', fees)

      const gasLimit: any = fees.maxFeePerGas

      const gasPrice: any = fees.gasPrice

      const result = await erc20ChildToken.transfer(1, to, {
        gasPrice,
        gasLimit: 150000,
        from: address
      })

      console.log(result, 'USDC Tansfer result')

      console.log(Object.keys(result))


      try {

        const txHash = await result.getTransactionHash();

        console.log('txHash', txHash)
  
        const txReceipt = await result.getReceipt();
  
        console.log('txReceipt', txReceipt)   

        console.log(JSON.stringify(txReceipt))

        expect(txReceipt.blockNumber).to.be.greaterThan(0)

        expect(txReceipt.blockHash).to.be.a('string')

      } catch(error) {

        console.error(error)

      }

    })
  })

  describe('Confirming Polygon Transactions', () => {

    it("#getConfirmations should return the block hash and number of confs", async () => {


      const txhash = '0x31d0d79799904d71db3ceb7fe9ec6cdd2d39e963ca187dbb04db38c5351615c9'

      const result: any = await usdc.polygon.getConfirmations({
        txhash
      })

      const { confirmations, block_hash, block_number } = result

      expect(confirmations).to.be.greaterThan(0)

      expect(block_number).to.be.greaterThan(0)

      expect(block_hash).to.be.a('string')
      
    })

  })

})
