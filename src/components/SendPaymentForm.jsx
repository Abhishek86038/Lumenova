import React, { useState, useEffect } from 'react';
import { Send, Loader2, AlertCircle, User, ArrowRight } from 'lucide-react';
import { isValidAddress, submitPayment } from '../services/stellarService';

export const SendPaymentForm = ({ wallet, onTxSuccess, onTxFailure }) => {
  const { publicKey: senderPublicKey, balance, refreshBalance } = wallet;
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Clear errors when inputs change
  useEffect(() => {
    setErrors(prev => ({ ...prev, general: null }));
  }, [recipient, amount]);

  const validate = () => {
    const newErrors = {};

    // Recipient validation
    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient address is required';
    } else if (!isValidAddress(recipient.trim())) {
      newErrors.recipient = 'Invalid Stellar public key format (must start with G)';
    } else if (recipient.trim() === senderPublicKey) {
      newErrors.recipient = 'Cannot send payment to yourself';
    }

    // Amount validation
    const parsedAmount = parseFloat(amount);
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    } else if (balance && parsedAmount > parseFloat(balance)) {
      newErrors.amount = `Amount exceeds your balance of ${balance} XLM`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await submitPayment(
        senderPublicKey,
        recipient.trim(),
        amount.trim()
      );
      
      // Success callback
      onTxSuccess({
        hash: response.hash,
        ledger: response.ledger,
        amount: amount.trim(),
        recipient: recipient.trim(),
      });

      // Clear inputs
      setRecipient('');
      setAmount('');
      
      // Auto refresh wallet balance after success
      await refreshBalance();
    } catch (err) {
      console.error(err);
      onTxFailure(err.message || 'Transaction submission failed');
      setGeneralError(err.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121620] border border-slate-800/80 rounded-2xl p-6 glow-indigo backdrop-blur-md">
      <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
        <Send className="w-5 h-5 text-indigo-400" />
        Send XLM Payment
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Recipient Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Recipient Stellar Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. GB3W...W4L6"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-3 bg-slate-900/60 border rounded-xl text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 transition duration-200 ${
                errors.recipient 
                  ? 'border-red-950 focus:ring-red-500/30' 
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {errors.recipient && (
            <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.recipient}
            </p>
          )}
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Amount (XLM)
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-slate-100 placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-2 pr-16 transition duration-200 ${
                errors.amount 
                  ? 'border-red-950 focus:ring-red-500/30' 
                  : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
              XLM
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 mt-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition duration-300 shadow-md hover:shadow-indigo-500/10 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing & Submitting Transaction...
            </>
          ) : (
            <>
              Confirm Payment
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* General Form Submission Error Banner */}
        {generalError && (
          <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4 text-red-400 text-sm flex gap-3 items-start mt-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Submission Failed:</span> {generalError}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
