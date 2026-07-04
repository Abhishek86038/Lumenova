import { Horizon, TransactionBuilder, Asset, Operation, Keypair } from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';

const server = new Horizon.Server(HORIZON_URL);

/**
 * Check if a Stellar public key is formatted correctly.
 * @param {string} publicKey 
 * @returns {boolean}
 */
export const isValidAddress = (publicKey) => {
  if (!publicKey || typeof publicKey !== 'string') return false;
  try {
    Keypair.fromPublicKey(publicKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Fetch native XLM balance for a public key.
 * Returns the balance as a string, or throws an error.
 * @param {string} publicKey 
 * @returns {Promise<string>}
 */
export const getAccountBalance = async (publicKey) => {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
    return xlmBalance ? xlmBalance.balance : '0';
  } catch (error) {
    if (error?.response?.status === 404) {
      throw new Error('Account not funded');
    }
    throw new Error(error?.message || 'Failed to fetch account balance');
  }
};

/**
 * Build, sign, and submit a payment transaction.
 * @param {string} senderPublicKey 
 * @param {string} receiverPublicKey 
 * @param {string} amount 
 * @returns {Promise<any>}
 */
export const submitPayment = async (senderPublicKey, receiverPublicKey, amount) => {
  if (parseFloat(amount) <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  try {
    const sourceAccount = await server.loadAccount(senderPublicKey);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100', // Basic fee in stroops
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.payment({
          destination: receiverPublicKey,
          asset: Asset.native(),
          amount: amount.toString(),
        })
      )
      .setTimeout(30)
      .build();

    // Sign the transaction with Freighter wallet
    const result = await signTransaction(transaction.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    // Submit transaction to Horizon
    const txToSubmit = TransactionBuilder.fromXDR(result.signedTxXdr, NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(txToSubmit);
    
    return response;
  } catch (error) {
    console.error('submitPayment error:', error);
    if (error?.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      const opCodes = codes.operations ? ` (${codes.operations.join(', ')})` : '';
      throw new Error(`Transaction failed: ${codes.transaction}${opCodes}`);
    }
    throw new Error(error?.message || 'Transaction failed');
  }
};
