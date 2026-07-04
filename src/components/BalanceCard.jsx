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
        setFundMessage({ type: 'success', text: 'Account funded! Refreshing...' });
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
        text: `Funding failed. Please visit manual Friendbot link.` 
      });
    } finally {
      setIsFunding(false);
    }
  };

  const isUnfunded = error === 'Account not funded' || balance === null;

  return (
    <div className="glass-card-premium p-6 flex flex-col justify-between h-[200px]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-slate-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
          <Coins className="w-4 h-4 text-[#00B4D8]" />
          Native Asset Balance
        </h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isFunding}
          className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/40 text-slate-300 hover:text-white transition duration-200 cursor-pointer disabled:opacity-40"
          title="Refresh Balance"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isUnfunded ? (
        <div className="flex flex-col gap-2">
          <div className="border border-amber-900/20 bg-amber-950/20 rounded-xl p-3 flex flex-col justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  This public address is new and doesn't exist on the ledger. Fund it to transact.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleFundWithFriendbot}
                disabled={isFunding}
                className="px-2.5 py-1.5 btn-premium-gradient text-white font-bold rounded-lg transition duration-200 text-[10px] cursor-pointer disabled:opacity-50"
              >
                {isFunding ? 'Funding...' : 'Fund Account (Friendbot)'}
              </button>
              
              <a 
                href={`https://friendbot.stellar.org/?addr=${publicKey}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-[#00B4D8] hover:underline"
              >
                Manual URL
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {fundMessage && (
            <div className="text-[10px] text-slate-400 truncate">
              {fundMessage.text}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-baseline gap-2">
            {/* Balance number 48px bold, XLM 20px uppercase letter-spacing 3px cyan color */}
            <span className="text-[48px] font-extrabold tracking-tight text-white leading-none">
              {parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
            </span>
            <span className="text-[20px] font-extrabold text-[#00B4D8] uppercase tracking-[3px] ml-1">
              XLM
            </span>
          </div>
          
          {/* Horizon connection healthy text smaller 12px + pulse animation */}
          <div className="flex items-center gap-2 mt-4 text-[12px] text-slate-500 animate-pulse-text">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Horizon connection healthy • Free instant transfers</span>
          </div>
        </div>
      )}
    </div>
  );
};
