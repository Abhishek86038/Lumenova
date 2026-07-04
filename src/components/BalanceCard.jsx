import React, { useState } from 'react';
import { RefreshCw, Coins, HelpCircle, ExternalLink, Activity } from 'lucide-react';

export const BalanceCard = ({ wallet }) => {
  const { publicKey, balance, error, refreshBalance } = wallet;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [fundMessage, setFundMessage] = useState(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshBalance();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFundWithFriendbot = async () => {
    if (!publicKey) return;
    setIsFunding(true);
    setFundMessage({ type: 'info', text: 'Requesting testnet XLM from Friendbot...' });
    try {
      const response = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`);
      if (response.ok) {
        setFundMessage({ type: 'success', text: 'Account funded successfully! Refreshing balance...' });
        // Wait a second for the ledger to close and update, then refresh
        setTimeout(async () => {
          await refreshBalance();
          setFundMessage(null);
        }, 2000);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fund account');
      }
    } catch (err) {
      console.error(err);
      setFundMessage({ 
        type: 'error', 
        text: `Funding failed. Please visit the manual Friendbot link below.` 
      });
    } finally {
      setIsFunding(false);
    }
  };

  const isUnfunded = error === 'Account not funded' || balance === null;

  return (
    <div className="bg-[#121620] border border-slate-800/80 rounded-2xl p-6 glow-emerald backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-slate-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
          <Coins className="w-4 h-4 text-emerald-400" />
          Native Asset Balance
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isFunding}
          className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition duration-200 cursor-pointer disabled:opacity-40"
          title="Refresh Balance"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isUnfunded ? (
        <div className="flex flex-col gap-4">
          <div className="border border-amber-900/30 bg-amber-950/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-200 text-sm">Account Not Funded</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  This public address is new and doesn't exist on the Stellar Testnet ledger yet. You must initialize it with free Testnet XLM from Friendbot to transact.
                </p>
              </div>
            </div>
            
            {/* Auto-fund Button */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <button
                onClick={handleFundWithFriendbot}
                disabled={isFunding}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium rounded-xl transition duration-200 shadow-md text-xs cursor-pointer disabled:opacity-50"
              >
                {isFunding ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Funding Account...
                  </>
                ) : (
                  'Fund with Friendbot (10,000 XLM)'
                )}
              </button>
              
              <a 
                href={`https://friendbot.stellar.org/?addr=${publicKey}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1 px-2 hover:bg-indigo-950/30 rounded-lg transition"
              >
                Manual Friendbot URL
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {fundMessage && (
            <div className={`p-3 rounded-lg text-xs font-medium border ${
              fundMessage.type === 'success' 
                ? 'bg-emerald-950/30 border-emerald-900/30 text-emerald-400' 
                : fundMessage.type === 'error' 
                ? 'bg-red-950/30 border-red-900/30 text-red-400' 
                : 'bg-indigo-950/30 border-indigo-900/30 text-indigo-400'
            }`}>
              {fundMessage.text}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 })}
            </span>
            <span className="text-xl font-bold text-emerald-400 tracking-wider">XLM</span>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
            <Activity className="w-3.5 h-3.5 text-emerald-500/70" />
            <span>Horizon connection healthy • Free instant transfers</span>
          </div>
        </div>
      )}
    </div>
  );
};
