import React, { useState } from 'react';
import { Send, User, Coins, CreditCard, ArrowRight } from 'lucide-react';
import { isValidAddress, submitPayment } from '../services/stellarService';

export const SendPaymentForm = ({ wallet, onTxSuccess, onTxFailure }) => {
  const { publicKey, balance, refreshBalance } = wallet;
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Field checks
    if (!recipient) {
      setValidationError('Recipient address is required.');
      return;
    }
    if (!amount) {
      setValidationError('Amount is required.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a valid amount greater than 0.');
      return;
    }

    if (numAmount > parseFloat(balance || 0)) {
      setValidationError(`Insufficient balance. You only have ${balance} XLM.`);
      return;
    }

    if (recipient === publicKey) {
      setValidationError('Self-payments are not permitted.');
      return;
    }

    // Address verification
    if (!isValidAddress(recipient)) {
      setValidationError('Invalid Stellar public key format (must start with G...).');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitPayment(publicKey, recipient, amount);
      // Update balance locally after a successful transaction
      await refreshBalance();
      onTxSuccess({
        hash: result.hash,
        recipient,
        amount,
        ledger: result.ledger
      });
    } catch (err) {
      console.error(err);
      onTxFailure(err.message || 'An error occurred while submitting payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card-premium p-6 flex flex-col justify-between h-[340px]">
      <div>
        <h3 className="text-slate-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#00B4D8]" />
          Send XLM Payment
        </h3>
        
        {validationError && (
          <p className="text-red-400 text-[11px] font-semibold mt-2 animate-pulse bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-900/30">
            {validationError}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        {/* Recipient Address Field */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
            <User className="w-4 h-4 text-slate-500" />
          </span>
          <input
            type="text"
            placeholder="Recipient Public Address (G...)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isSubmitting}
            className="w-full pl-12 pr-4 py-4 rounded-[14px] bg-[#1A2333] border border-slate-800/80 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] text-white text-xs font-mono tracking-wider outline-none placeholder:text-slate-500 transition duration-200"
          />
        </div>

        {/* Amount Field */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 pointer-events-none">
            <Coins className="w-4 h-4 text-slate-500" />
          </span>
          <input
            type="number"
            step="any"
            placeholder="Amount (XLM)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            className="w-full pl-12 pr-16 py-4 rounded-[14px] bg-[#1A2333] border border-slate-800/80 focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] text-white text-xs outline-none placeholder:text-slate-500 transition duration-200"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
            XLM
          </span>
        </div>

        {/* Confirm Payment Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[52px] rounded-[16px] btn-premium-gradient hover:shadow-[#00B4D8]/30 hover:-translate-y-[3px] active:translate-y-0 text-white font-bold tracking-wider text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 transition duration-300"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Transaction...
            </>
          ) : (
            <>
              Confirm Payment
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
