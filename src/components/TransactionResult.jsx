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
    <div className={`glass-card-premium p-6 ${
      isSuccess 
        ? 'border-emerald-500/20' 
        : 'border-red-500/20'
    }`}>
      <div className="flex flex-col items-center text-center gap-4">
        {/* Status Icon */}
        <div className={`p-4 rounded-2xl ${
          isSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {isSuccess ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <XCircle className="w-10 h-10" />
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className={`text-xl font-bold ${
            isSuccess ? 'text-emerald-300' : 'text-red-300'
          }`}>
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {isSuccess 
              ? `Sent ${result.amount} XLM native tokens on-chain.` 
              : 'The transaction could not be processed by the ledger.'
            }
          </p>
        </div>

        {/* Details Card */}
        <div className="w-full bg-[#1A2333]/80 border border-slate-800/80 rounded-xl p-4 mt-2 text-left flex flex-col gap-3 text-xs">
          {isSuccess ? (
            <>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Recipient:</span>
                <span className="font-mono text-slate-200 break-all select-all ml-4 text-[10px]">
                  {result.recipient}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-medium">Ledger Sequence:</span>
                <span className="text-slate-200 font-mono font-semibold">{result.ledger}</span>
              </div>
              <div className="flex flex-col gap-1.5 py-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Transaction Hash:</span>
                  <button 
                    onClick={() => copyToClipboard(result.hash)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Copy Tx Hash"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="font-mono text-[10px] text-slate-300 bg-slate-950/40 p-2 rounded.border border-slate-800/40 break-all select-all">
                  {result.hash}
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-300 font-medium py-1">
              <span className="text-slate-400 font-bold block mb-1">Reason / Error Detail:</span>
              <p className="font-mono text-[11px] text-slate-300 leading-relaxed bg-red-950/20 p-3 rounded border border-red-950/30">
                {result.error}
              </p>
              <div className="text-[10px] text-slate-400 mt-3 leading-relaxed">
                Common checks:
                <ul className="list-disc list-inside mt-1 space-y-1 font-normal">
                  <li>Ensure the recipient has at least <strong className="text-slate-300">1.6 XLM</strong> if unfunded.</li>
                  <li>Check if Freighter wallet is currently unlocked.</li>
                  <li>Verify transaction was signed within Freighter's window.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={onClear}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white font-bold border border-slate-800 rounded-xl transition duration-200 cursor-pointer text-xs"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            Back to Wallet
          </button>
          
          {isSuccess && (
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 btn-premium-gradient text-white font-bold rounded-xl transition duration-200 cursor-pointer text-xs shadow-md"
            >
              Stellar Explorer
              <ExternalLink className="w-4.5 h-4.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
