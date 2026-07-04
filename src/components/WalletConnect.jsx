import React from 'react';
import { Wallet, LogOut, AlertTriangle, CheckCircle2, Download } from 'lucide-react';

export const WalletConnect = ({ wallet }) => {
  const { 
    isConnected, 
    isFreighterInstalled, 
    publicKey, 
    network, 
    connect, 
    disconnect, 
    isLoading 
  } = wallet;

  const truncateKey = (key) => {
    if (!key) return '';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  };

  const isTestnet = network === 'TESTNET';

  if (!isFreighterInstalled) {
    return (
      <div className="glass-card-premium p-6 border-red-900/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-950/40 text-red-400 border border-red-900/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-200">Freighter Extension Required</h3>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
              We couldn't detect the Freighter browser extension. To interact with the Stellar Testnet, please install the official extension.
            </p>
            <a 
              href="https://www.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 btn-premium-gradient text-white font-semibold rounded-xl transition duration-200 shadow-md text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Install Freighter Wallet
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="glass-card-premium p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Stellar Wallet Connection</h3>
          <p className="text-slate-400 text-sm mt-1">
            Connect your Freighter wallet to query balance and send XLM payments.
          </p>
        </div>
        <button
          onClick={connect}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 btn-premium-gradient text-white font-semibold rounded-xl shadow-lg cursor-pointer transform hover:-translate-y-0.5 hover:shadow-cyan-500/20 active:translate-y-0 disabled:opacity-50 text-sm"
        >
          <Wallet className="w-4 h-4" />
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Network Warning Banner */}
      {network && !isTestnet && (
        <div className="glass-card-premium p-4 border-amber-500/30 flex items-center gap-3 text-amber-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold">Network Warning:</span> Your Freighter wallet is currently set to <span className="font-bold underline uppercase">{network}</span>. Please switch Freighter's network settings to <span className="font-bold underline">TESTNET</span> to avoid errors.
          </div>
        </div>
      )}

      {/* Wallet Status Info Card */}
      <div className="glass-card-premium p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-900/60 text-[#00B4D8] border border-slate-800/40">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Pulsing green dot next to Connected Account */}
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulsing-dot-green"></span>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Connected Account</span>
              {isTestnet ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-900/20">
                  Testnet
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/40 text-amber-400 border border-amber-900/20">
                  {network || 'Unknown'}
                </span>
              )}
            </div>
            <p className="text-slate-100 font-mono text-lg font-bold mt-1 tracking-wider">
              {truncateKey(publicKey)}
            </p>
          </div>
        </div>
        
        {/* Transparent with cyan border */}
        <button
          onClick={disconnect}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent hover:bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/40 hover:border-[#00B4D8] font-bold rounded-xl transition duration-200 cursor-pointer text-sm shadow-md"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    </div>
  );
};
