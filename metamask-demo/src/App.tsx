import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3'

import MetaMaskSDK from '@metamask/sdk';

import { ethers } from 'ethers'

import USDC_ABI from './contracts/polygon/usdc_abi'
import BigNumber from 'bignumber.js';

import { use } from '@maticnetwork/maticjs'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-web3'

// install web3 plugin
use(Web3ClientPlugin)

const chainIds = {
  0x1: 'Ethereum',
  0x89: 'Polygon'
}

function App() {

  //@ts-ignore
  window.ethers = ethers

  const [metamask, setMetamask] = React.useState<any>(null)

  const [provider, setProvider] = React.useState<ethers.AbstractProvider | null>(null)

  useEffect(() => {

    if (metamask) {

      console.log('metamask', metamask)

      metamask.on('chainChanged', (chainId: any) => {

        console.log('metamask.chainChanged', chainId)

        if (chainId !== '0x89') {

          alert(`Please connect to Polygon Mainnet. You are currently connected to ${chainId}`)
          return
        }

        console.log('metamask.polygon.connected')

        //const provider = new ethers.providers.Web3Provider(window.ethereum);
      });

      metamask.on('accountsChanged', (accounts: any) => {

        console.log('metamask.accountsChanged', accounts)
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
      });
    }

    return () => {

      if (metamask) {

        metamask.off('chainChanged')
        metamask.off('accountsChanged')
      }
    }

  }, [metamask])

  function disconnectWallet() {

    if (metamask) {

      setMetamask(null)


    }
  }

  async function getUSDCBalance(address: string): Promise<number> {

    const web3 = new Web3(Web3.givenProvider);

    const ABI: any = USDC_ABI

    const myContract = new web3.eth.Contract(ABI, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174');

    const balance = await myContract.methods.balanceOf(address).call()

    console.log('balance', balance)

    return new BigNumber(balance).dividedBy(10 ** 6).toNumber()

  }

  async function sendUSDC({address, amount} : {address: string, amount: number}): Promise<number> {

    const web3 = new Web3(Web3.givenProvider);

    const ABI: any = USDC_ABI

    const myContract = new web3.eth.Contract(ABI, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174');

    const result = await myContract.methods.transfer(address, 1).call()

    return result

  }


  async function sendYourselfMATIC() {

    if (metamask) {

      const balance = await getUSDCBalance(metamask.selectedAddress)

      alert(`Your USDC balance is ${balance} USDC`)

      const result = await sendUSDC({address: metamask.selectedAddress, amount: 1 })

    }

  }

  async function sendYourselfUSDC() {

    console.log('send yourself USDC', metamask)

    if (metamask) {

      const provider = new ethers.BrowserProvider(metamask)

      console.log('provider', provider)

      const signer = await provider.getSigner()

      console.log('signer', signer)

      const usdcContract = new ethers.Contract('0x2791bca1f2de4661ed88a30c99a7a9449aa84174', USDC_ABI, provider)

      console.log('usdcContract', usdcContract)

      const sender = metamask.selectedAddress
      const amount = 0.01
      const recipient = metamask.selectedAddress

      console.log('transfer', { sender, amount, recipient })

      console.log('transfer function', usdcContract.transfer)

      const result = await usdcContract.transfer('0xf04386e8cf07c7761c9ee365e392ff275d1ebf55', amount);
      
      console.log("transfer.result", result)

    }

  }

  const connectWallet = async () => {

    try {
      
      const MMSDK = new MetaMaskSDK(/*options*/);

      const metamask = MMSDK.getProvider(); // You can also access via window.ethereum

      setMetamask(metamask)

      metamask.on('chainChanged', (chainId: string) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        console.log('metamask.chainChanged', {chainId})
      });

      console.log('Chain', metamask.chainId)

      if (metamask.chainId !== '0x89') {

        alert(`Please connect to Polygon Mainnet. You are currently connected to ${metamask.chainId}`)
        return
      }

      console.log('metamask.polygon.connected')

      const accounts = await metamask.request({ method: 'eth_requestAccounts', params: [] });

      console.log('Accounts', accounts);

      return accounts

    } catch(error) {

      console.log('Error', error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {!metamask ? (

          <a
            className="App-link"
            href="#"
            target=""
            rel=""
            onClick={connectWallet}
          >
            Connect Wallet      
          </a>

        ) : (

          <>

            <a
              className="App-link"
              href="#"
              target=""
              rel=""
              onClick={sendYourselfMATIC}
            >
              Send Yourself 1 USDC
            </a>

            <a
              className="App-link"
              href="#"
              target=""
              rel=""
              onClick={sendYourselfMATIC}
            >
              Get your USDC Balance
            </a>

            <a
              className="App-link"
              href="#"
              target=""
              rel=""
              onClick={disconnectWallet}
            >
              Disonnect Wallet      
            </a>

          </>
          
        )}


      </header>
    </div>
  );
}

export default App;
