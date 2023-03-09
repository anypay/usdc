require('dotenv').config()

import axios from 'axios'

/**
 * 
 * Alchemy Resources:
 * 
 *  https://docs.alchemy.com/reference/how-to-use-alchemy-sdk-with-typescript
 */

import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.alchemy_polygon_api_key,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

type HexString = string;

export interface EthGetTransactionResult {
    blockHash: HexString;
    blockNumber: HexString;
    hash: HexString;
    accessList: HexString[];
    chainId: HexString;
    from: HexString;
    gas: HexString;
    gasPrice: HexString;
    input: HexString;
    maxFeePerGas: HexString;
    maxPriorityFeePerGas: HexString;
    nonce: HexString;
    r: HexString;
    s: HexString;        
    to: HexString;
    transactionIndex: HexString;
    type: HexString;
    v: HexString;
    value: HexString;
}

/**
 * 
 * @param txid getTransaction
GET
https://alchemy-sdk-core-example.com/{apiKey}/getTransaction
Returns the information about a transaction requested by transaction hash or number. In the response object, blockHash, blockNumber, and transactionIndex are null when the transaction is pending.
 * @returns 
 */

export async function getTransaction(txid: string): Promise<EthGetTransactionResult> {

    const url = `https://ethereum-mainnet.g.alchemy.com/v2/${process.env.alchemy_polygon_api_key}`

    try {

        const { data } = await axios.post(url, {
            jsonrpc: "2.0",
            method: "eth_getTransactionByHash",
            params: [txid],
            id: 1
        })

        if (data.error) {

            console.error('etherem.alchemy.getTransaction.error', data.error)

            throw new Error(data.error.message)
        }

        return data.result


    } catch(error) {

        console.error('etherem.alchemy.getTransaction.error', error.response.data.error)

        throw new Error(error.response.data.error.message)

    }

}