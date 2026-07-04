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

  // Helper to truncate address: e.g. GB3W...W4L6
  const truncateKey = (key) => {
    if (!key) return '';
    return `${key.slice(0, 6)}...${key.slice(-4)}`;
  };

  const isTestnet = network === 'TESTNET';

  if (!isFreighterInstalled) {
    return (
      <div className="bg-[#121620] border border-red-900/40 rounded-2xl p-6 glow-danger backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-red-950/50 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-200">Freighter Extension Required</h3>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              We couldn't detect the Freighter browser extension. To interact with the Stellar Testnet, please install the official extension.
            </p>
            <a 
              href="https://www.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-medium rounded-xl transition duration-200 shadow-md text-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Install Freighter Wallet
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-[#121620] border border-slate-800/80 rounded-2xl p-6 glow-indigo backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Stellar Wallet Connection</h3>
          <p className="text-slate-400 text-sm mt-1">
            Connect your Freighter wallet to query balance and send XLM payments.
          </p>
        </div>
        <button
          onClick={connect}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg cursor-pointer transform hover:-translate-y-0.5 hover:shadow-indigo-500/20 active:translate-y-0 disabled:opacity-50"
        >
          <Wallet className="w-5 h-5" />
          {isLoading ? 'Connecting...' : 'Connect Freighter Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Network Warning Banner */}
      {network && !isTestnet && (
        <div className="bg-[#121620] border border-amber-500/40 rounded-xl p-4 glow-indigo flex items-center gap-3 text-amber-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">Network Warning:</span> Your Freighter wallet is currently set to <span className="font-bold underline uppercase">{network}</span>. Please switch Freighter's network settings to <span className="font-bold underline">TESTNET</span> to avoid errors.
          </div>
        </div>
      )}

      {/* Wallet Status Info Card */}
      <div className="bg-[#121620] border border-slate-800/80 rounded-2xl p-6 glow-purple backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-medium">Connected Account</span>
              {isTestnet ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/50 text-emerald-400 border border-emerald-900/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Testnet
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/50 text-amber-400 border border-amber-900/30">
                  <AlertTriangle className="w-3 h-3" />
                  {network || 'Unknown'}
                </span>
              )}
            </div>
            <p className="text-slate-100 font-mono text-lg mt-0.5 tracking-wider">
              {truncateKey(publicKey)}
            </p>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-medium rounded-xl transition duration-200 cursor-pointer text-sm shadow-md"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    </div>
  );
};
