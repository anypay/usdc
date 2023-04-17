
require('dotenv').config()

import alchemy from './alchemy'

import { hexToDec } from 'hex2dec'

import Web3 from 'web3'

/**
 * 
 * Polygon Resources:
 * 
 * - https://polygon.technology/solutions/polygon-pos/
 * - https://www.covalenthq.com/docs/api/#/0/0/USD/1
 * - https://cointelegraph.com/blockchain-for-beginners/polygon-blockchain-explained-a-beginners-guide-to-matic
 * - https://github.com/maticnetwork/matic.js/
 * - https://wiki.polygon.technology/docs/develop/ethereum-polygon/matic-js/get-started/
 * - https://c0f4f41c-2f55-4863-921b-sdk-docs.github.io/guide/sending-transactions.html#example
 * - https://medium.com/@kaishinaw/connect-metamask-with-ethers-js-fc9c7163fd4d
 * - https://forum.polygon.technology/t/impact-of-eip1559-and-future-possibilities/1749
 * - https://berndstrehl.medium.com/parsing-an-erc20-transfer-with-javascript-from-the-eth-api-2790da37e55f
 * 
 */

export * as alchemy from './alchemy'

import axios from 'axios'

import { getTransaction } from './alchemy'

import { ethers } from 'ethers'

import BigNumber from 'bignumber.js'

import ERC20_ABI from '../ethereum/erc20_abi';

const usdc_token_address = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

const matic_token_address = '0x0000000000000000000000000000000000001010'

export interface CovalentTokenBalanceResponseItem {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  last_transferred_at: string;
  native_token: boolean,
  type: string;
  balance: string;
  balance_24h: string;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  quote_24h: number;
  nft_data: any;
}

/**
 * Fetches the token balances from a Polygon blockchain provider. It is designed to support
 * ERC-20 tokens on Polygon, specificially USDC.
 *
 */
export async function getTokenBalance(params: {address: string, asset: string}): Promise<number> {

  const covalentChainID = 137

  const url = `https://api.covalenthq.com/v1/${covalentChainID}/address/${params.address}/balances_v2/`

  const { data } = await axios.get(url, {
    auth: {
      username: String(process.env.covalent_api_key),
      password: ''
    }
  })

  const contract = data.data.items.find((item: CovalentTokenBalanceResponseItem) => item.contract_address === params.asset)

  if (!contract) { return 0 }

  return new BigNumber(`${contract.balance}e-${contract.contract_decimals}`).toNumber()

}

/** 
 * # USD Coin (PoS) (USDC)
 *
 * USD Coin is an ERC-20 stablecoin brought to you by Circle and Coinbase. It is issued by regulated and licensed financial institutions that maintain full reserves of the equivalent fiat currency.
 *
 * The contract address for USDC on Polygon is 0x2791bca1f2de4661ed88a30c99a7a9449aa84174 and more information may be
 * found on the [Polygon USDC Blockchain
 * Explorer](https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174)
 *
 *
 */
export async function getUSDCBalance(params: {address: string}): Promise<number> {

  return getTokenBalance({
    asset: usdc_token_address,
    address: params.address
  })

}

/**
 * Fetches the MATIC balances from a Polygon blockchain provider. 
 *
 */
export async function getGasBalance(params: {address: string}): Promise<number> {

  return getTokenBalance({
    asset: matic_token_address,
    address: params.address
  })

}


/**
 * Returns a new randomly-generated address that cannot receive funds
 * because the private key is not returned
 *
 */
export function newRandomAddress(): string {

  let address = ethers.Wallet.createRandom().address

  return address;

}

/**
 * Returns a new randomly-generated address that cannot receive funds
 * because the private key is not returned
 *
 */
export function getAddressFromMnemonic({ mnemonic }: {mnemonic: string }): string {

  return ethers.Wallet.fromMnemonic(mnemonic).address ;

}

/**
 * Determines whether a string is or is not a valid Polygon address 
 */
export function isAddress({ address }: {address: string }): boolean {

  return ethers.utils.isAddress(address) ;

}

/**
 * 
 * Builds a new signed transaction to send USDC to a given address given the wallet private key.
 * This function does not transmit or broadcast the transaction and therefore no gas will
 * be spent until the transaction is sent by a subsequent call to sendSignedTransaction.
 * 
 * Example ERC20 Transfer: https://etherscan.io/tx/0xeda0433ebbb12256ef1c4ab0278ea0c71de4832b7edd65501cc445794ad1f46c
 * 
 */
export async function buildUSDCTransfer({ mnemonic, to, amount, transmit=false }: { mnemonic: string, to: string, amount: number, transmit?: boolean }): Promise<{
  txhex: string,
  txid: string;
}> {

  const {chainId} = ethers.providers.getNetwork('matic')

  const provider = new ethers.providers.JsonRpcProvider(process.env.infura_polygon_url, chainId)

  const senderWallet = ethers.Wallet.fromMnemonic(mnemonic).connect(provider)

  console.log(senderWallet.address, 'sender')

  let contract = new ethers.utils.Interface(ERC20_ABI)

  const data = contract.encodeFunctionData("transfer", [ to, amount ])

  const fees = await provider.getFeeData()

  const gasPrice: any = fees.gasPrice

  const transactionRequest = {
    gasPrice,
    to: usdc_token_address,
    data
  }

  const populatedTransactionRequest = await senderWallet.populateTransaction(transactionRequest)

  const signedTxHex = await senderWallet.signTransaction(populatedTransactionRequest)

  const transaction = decodeTransactionHex({ transactionHex: signedTxHex })

  const transfer = parseERC20Transfer(transaction)
  
  return { txhex: signedTxHex, txid: transfer.hash }
}

interface TransmitResult {
  blockHash: string,
  blockNumber: number,
  contractAddress: string,
  cumulativeGasUsed: number,
  effectiveGasPrice: number,
  from: string,
  gasUsed: number,
  logs: any[]
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

export async function broadcastSignedTransaction({ txhex }: {txhex: string}): Promise<TransmitResult> {

  console.log("broadcastSignedTransaction", txhex)

  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url))

  const transmitResult: any = await web3.eth.sendSignedTransaction(txhex)

  console.log('polygon.provider.sendTransaction.result', transmitResult)

  return transmitResult

}

export function decodeTransactionHex({ transactionHex }: {transactionHex: string}): ethers.Transaction {

  const transaction: ethers.Transaction = ethers.utils.parseTransaction(transactionHex)

  return transaction

}

export function parseERC20Transfer(transaction: ethers.Transaction): {
  receiver: string,
  amount: number,
  symbol: string,
  hash: string,
  sender: string,
} {

  const input = transaction.data;

  if (
    input.length !== 138 ||
    input.slice(2, 10) !== "a9059cbb"
  ) {
    throw "NO ERC20 TRANSFER";
  }
  const receiver = `0x${transaction.data.slice(34, 74)}`;
  const amount = hexToDec(transaction.data.slice(74));
  const symbol = transaction.to;
  const sender = transaction.from;
  const hash = transaction.hash
  return { receiver, amount, symbol, hash, sender };
}

interface USDCOutput {
  address: string;
  amount: number;
  chain: string;
  currency: string;
  txid: string;
  txhex: string;
  decimals: number;
}

export function parseUSDCOutput({ transactionHex }: { transactionHex: string }): USDCOutput | null {

  const transaction = decodeTransactionHex({ transactionHex })

  const { receiver, amount, symbol, sender, hash } = parseERC20Transfer(transaction)

  if (transaction.to !== '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174') {
    return null;
  }

  return {
    chain: 'MATIC',
    currency: 'USDC',
    address: receiver,
    amount: amount,
    txid: hash,
    txhex: transactionHex,
    decimals: 6
  }

}

export async function getConfirmations({ txhash }: { txhash: string }): Promise<{
  block_hash?: string;
  block_number?: number;
  confirmations: number;
}> {

  const [result, blockHeight] = await Promise.all([
    getTransaction(txhash),
    alchemy.core.getBlockNumber()
  ])

  if (!result) { return { confirmations: 0 }}

  const block_number = Number(result.blockNumber)

  const block_hash = result.blockHash

  if (!result.blockNumber) {
    return { block_number, block_hash, confirmations: 0 }
  }

  const confirmations = blockHeight - block_number

  return { block_number, block_hash, confirmations }

}

interface GetTransactionByHashResult {
  accessList?: any[];
  blockHash: string;
  blockNumber: number;
  chainId?: string;
  from: string;
  gas: number;
  gasPrice: string;
  hash: string;
  input: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  nonce: number;
  r: string;
  s: string;
  to: string;
  transactionIndex: number;
  type?: number;
  v: string;
  value: string;
}

export async function fetchERC20Transfer({ txid }: { txid: string }): Promise<{
  parsed: {
    address: string,
    amount: number,
    token: string
  },
  full: GetTransactionByHashResult
}> {

  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.infura_polygon_url))

  const result: any = await web3.eth.getTransaction(txid)

  const input = result.input

  if (
    input.length !== 138 ||
    input.slice(2, 10) !== "a9059cbb"
  ) {
    throw "NO ERC20 TRANSFER";
  }
  const address = `0x${input.slice(34, 74)}`;
  const amount = parseInt(hexToDec(input.slice(74)));
  const token = result.to.toLowerCase();

  return {
    parsed: {
      address,
      amount,
      token
    },
    full: result
  }

}

export { getPosClient } from './pos_client'

