
import { POSClient,use } from "@maticnetwork/maticjs"
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3'
import HDWalletProvider = require("@truffle/hdwallet-provider")

import { providers, Wallet } from "ethers";

const CHAIN_ID = 137

const parentProvider = new providers.JsonRpcProvider(process.env.infura_polygon_url, CHAIN_ID);
const childProvider = new providers.JsonRpcProvider(process.env.infura_polygon_url, CHAIN_ID);

// install web3 plugin
use(Web3ClientPlugin);

var initialized = false;

export const posClient = new POSClient();

export async function getPosClient({ mnemonic, address, provider }: {mnemonic?: string, address: string, provider?: 'ethers' | 'web3'}) {

  if (!provider) { provider = 'web3' }

    if (!initialized) {  

        if (provider == 'web3') {

          await posClient.init({
              network: 'mainnet',
              version: 'v1',
              parent: {
                provider: new HDWalletProvider({
                  mnemonic,
                  providerOrUrl: String(process.env.infura_polygon_url)
                }),
                defaultConfig: {
                  from : address
                }
              },
              child: {
                provider: new HDWalletProvider({
                  mnemonic,
                  providerOrUrl: String(process.env.infura_polygon_url)
                }),
                defaultConfig: {
                  from : address
                }
              }
          })

          initialized = true

        } else if (provider == 'ethers') {

          const wallet = Wallet.fromMnemonic(mnemonic)

          await posClient.init({
            network: 'mainnet',
            version: 'v1',
            parent: {
              provider: new Wallet(wallet.privateKey, parentProvider),
              defaultConfig: {
                from : address
              }
            },
            child: {
              provider: new Wallet(wallet.privateKey, parentProvider),
              defaultConfig: {
                from : address
              }
            }
          })

          initialized = true

        }

    }

    return posClient

}
