
import { EventEmitter } from 'events';

/**
 * 
 * Consensus is the abstract class that all consensus algorithms should extend.
 * 
 * Consensus algorithms are responsible for maintaining the blockchain and
 * ensuring that the blockchain is valid. They are also responsible for
 * maintaining the state of the blockchain.
 * 
 * Signed transactions are sent to the consensus algorithm to be added to the
 * blockchain. The consensus algorithm will then validate the transaction and
 * add it to the blockchain, a process that could take seconds, minutes, or
 * hours depending on the consensus algorithm and network conditions.
 * 
 * Upon updates to the state of the transaction through the consensus process,
 * the consensus algorithm will emit events that can be listened to by the
 * application. These events include:
 * 
 * - Transaction added to the mempool
 * - Transaction confirmed in a block
 * - Transaction definitively rejected
 * 
 */

interface MempoolTransaction {
    txid: string;
    txhex: string;
    acceptedAt: Date;
    acceptedByIp: string;
}

interface ConfirmedTransaction {
    txid: string;
    txhex: string;
    confirmedAt: Date;
    blockHash: string;
    blockHeight: number;
}

interface FailedTransaction {
    txid: string;
    txhex: string;
    reason: string;
    error: Error;
}

interface Transaction {
    chain: string;
    txid: string;
    txhex: string;
}

type Txid = string;

type Transactions = Map<Txid, Transaction>;

type FailedHandlers =  Map<Txid, ((transaction: FailedTransaction) => void[])>;

type MempoolHandlers =  Map<Txid, ((transaction: MempoolTransaction) => void[])>;

type ConfirmedHandlers =  Map<Txid, ((transaction: ConfirmedTransaction) => void[])>;

type TransactionReference = {txid: string, chain?: string} | {txhex: string, chain?: string};

interface CheckForConfirmationResult {
    status: 'confirmed' | 'failed' | 'pending';
    error?: Error;
    blockHash?: string;
    blockHeight?: number;
    reason?: string;
    txRef: TransactionReference;
    confirmedAt?: Date;
}

export abstract class Consensus extends EventEmitter { 

    transactions: Transactions = new Map();

    failedHandlers: FailedHandlers = new Map();

    async sumbitTransaction(transaction: Transaction): Promise<void> {

        this.emit('transaction.received', transaction)
    }

    async onMempool(callback: (transaction: MempoolTransaction) => void): Promise<void> {

        this.emit('onMempool.handler.registered')
    }

    async onConfirmed(callback: (transaction: ConfirmedTransaction) => void): Promise<void> {
    }

    async onFailed(callback: (transaction: any) => void): Promise<void> {
    }

    private handleFailed(transaction: Transaction, reason: string, error: Error) {
        // Handle failed transaction
    }

    private async saveTransaction(transaction: Transaction) {
        // Save transaction to database for restoration across system restarts
    }

    private async loadTransaction(txRef: TransactionReference): Promise<Transaction | void> {
        // Save transaction to database for restoration across system restarts
    }

    abstract checkForConfirmation(txRef: TransactionReference): Promise<CheckForConfirmationResult>
}

class SolanaConsensus extends Consensus {

    async checkForConfirmation(txRef: TransactionReference): Promise<CheckForConfirmationResult> {

        var confirmation = false, failed, error, blockHash, blockHeight, reason, confirmedAt;

        if (confirmation) {

            return {
                status: 'confirmed',
                blockHash,
                blockHeight,
                txRef,
                confirmedAt
            }

        } else {

            if (failed) {

                return {
                    status: 'failed',
                    error,
                    reason,
                    txRef
                }
            } else {

                return {
                    status: 'pending',
                    txRef
                }

            }                

        }
    }

}

class PolygonConsensus extends Consensus {

}

class BitcoinCoreConsensus extends Consensus {

}

class EthereumConsensus extends Consensus {

}



const consensus = new SolanaConsensus();
