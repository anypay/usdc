
import moment from 'moment'

interface IPaymentRequest {
  time: Date;
  expires: Date;
  memo: string;
  paymentUrl: string;
  paymentId: string;
  paymentOptions: {
    chain: string;
    currency: string;
    network: string;
    estimatedAmount: number;
    requiredFeeRate: number;
    minerFee?: number;
    decimals?: number;
    selected?: boolean;
  }[]
}

interface PaymentRequestTemplate {
  chain: string;
  currency: string;
  to: {
    address: string;
    amount: number;
  }[];
}[]

interface EthPaymentOption {
  instructions: {
    type: 'transaction';
    value: number;
    to: string;
    data?: string;
    gasPrice?: number;
  }[];
}

/*
class PolyonPaymentRequest extends PaymentRequest {

  submitPayment(txhex: string): Promise<string> {

    // validate transaction
    // check mempool if transaction already received
    // broadcast transaction
    // confirm transaction

    return ''

  }

}
*/

class PaymentRequest {

  time: Date;
  expires: Date;
  memo: string;
  paymentUrl: string;
  paymentId: string;

  paymentOptions: {
    chain: string;
    currency: string;
    network: string;
    estimatedAmount: number;
    requiredFeeRate: number;
    minerFee?: number;
    decimals?: number;
    selected?: boolean;
  }[]

  constructor(template: PaymentRequestTemplate) {
  }


}

export async function create({ template }:{ template: PaymentRequestTemplate[]}): Promise<PaymentRequest> {

  const time = new Date()
  const expires = moment().add(15, 'minutes').toDate()
  const memo = ''
  const paymentUrl = ''
  const paymentId = ''

  const paymentOptions = template.map(option => {
    return {
      requiredFeeRate: 1,
      estimatedAmount: option.to.reduce((sum, to) => sum + to.amount, 0),
      chain: option.chain,
      currency: option.currency,
      network: 'main'
    }
  })

  return {
    time,
    expires,
    memo,
    paymentUrl,
    paymentId,
    paymentOptions
  }

}

export async function option({
  template,
  chain,
  currency
}: {
  template: PaymentRequestTemplate[],
  chain: string;
  currency: string;
}): Promise<EthPaymentOption> {

  const option = template.find(option => option.chain === chain && option.currency === currency)

  if (!option) { throw new Error('ETHPaymentOption not found') }

  return {
    instructions: option.to.map(to => {
      return {
        type: 'transaction',
        to: to.address,
        value: to.amount
      }
    })
  }

}

