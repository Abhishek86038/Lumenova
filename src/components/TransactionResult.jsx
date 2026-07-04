import React from 'react';
import { CheckCircle2, XCircle, ExternalLink, ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const TransactionResult = ({ result, onClear }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = result.status === 'success';

  return (
    <div className={`border rounded-2xl p-6 backdrop-blur-md transition-all duration-300 ${
      isSuccess 
        ? 'bg-emerald-950/10 border-emerald-900/40 glow-emerald' 
        : 'bg-red-950/10 border-red-900/40 glow-danger'
    }`}>
      <div className="flex flex-col items-center text-center gap-4">
        {/* Status Icon */}
        <div className={`p-4 rounded-full ${
          isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isSuccess ? (
            <CheckCircle2 className="w-12 h-12" />
          ) : (
            <XCircle className="w-12 h-12" />
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className={`text-2xl font-bold ${
            isSuccess ? 'text-emerald-300' : 'text-red-300'
          }`}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {isSuccess 
              ? `Successfully sent ${result.amount} XLM native tokens.` 
              : 'The transaction could not be completed.'
            }
          </p>
        </div>

        {/* Details Card */}
        <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 mt-2 text-left flex flex-col gap-3 font-medium text-xs">
          {isSuccess ? (
            <>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Recipient:</span>
                <span className="font-mono text-slate-200 break-all select-all ml-4">
                  {result.recipient}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Ledger Sequence:</span>
                <span className="text-slate-200 font-mono">{result.ledger}</span>
              </div>
              <div className="flex flex-col gap-1.5 py-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Transaction Hash:</span>
                  <button 
                    onClick={() => copyToClipboard(result.hash)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Copy Tx Hash"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-800/40 break-all select-all">
                  {result.hash}
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-300 font-medium py-1">
              <span className="text-slate-400 font-bold block mb-1">Reason / Error Detail:</span>
              <p className="font-mono text-slate-300 leading-relaxed bg-red-950/20 p-3 rounded border border-red-950/30">
                {result.error}
              </p>
              <div className="text-xs text-slate-400 mt-3 leading-relaxed">
                Common errors:
                <ul className="list-disc list-inside mt-1 space-y-1 font-normal">
                  <li>Recipient account is unfunded and requires sending at least <strong className="text-slate-300">1.6 XLM</strong> (Stellar minimum reserve rules).</li>
                  <li>Insufficient balance in your wallet to cover the transaction amount + network fee.</li>
                  <li>Signature rejected by user.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={onClear}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium rounded-xl transition duration-200 cursor-pointer text-sm shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Wallet
          </button>
          
          {isSuccess && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold rounded-xl transition duration-200 cursor-pointer text-sm shadow-md"
            >
              Stellar Explorer
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
