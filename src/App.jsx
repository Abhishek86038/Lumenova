import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { WalletConnect } from './components/WalletConnect';
import { BalanceCard } from './components/BalanceCard';
import { SendPaymentForm } from './components/SendPaymentForm';
import { TransactionResult } from './components/TransactionResult';
import { Send, Zap, ShieldAlert, Cpu } from 'lucide-react';

function App() {
  const wallet = useWallet();
  const { isConnected, error: walletError, isLoading } = wallet;
  const [txResult, setTxResult] = useState(null);

  const handleTxSuccess = (details) => {
    setTxResult({
      status: 'success',
      ...details
    });
  };

  const handleTxFailure = (errorMessage) => {
    setTxResult({
      status: 'failure',
      error: errorMessage
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0A0E27] text-slate-100 bg-dot-grid bg-grain pb-20 overflow-hidden font-sans">
      {/* 2 Soft glowing orbs: cyan at 20% left, blue at 80% right with blur 200px */}
      <div className="absolute top-[15%] left-[20%] w-[350px] h-[350px] rounded-full bg-[#00B4D8]/10 blur-[200px] pointer-events-none"></div>
      <div className="absolute bottom-[25%] right-[20%] w-[450px] h-[450px] rounded-full bg-[#0077FF]/10 blur-[200px] pointer-events-none"></div>

      {/* Main Header / Navigation */}
      <header className="border-b border-slate-800/40 bg-[#0A0E27]/40 backdrop-blur-md sticky top-0 z-50 px-6">
        <div className="max-w-6xl mx-auto py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#0077FF] text-white shadow-lg shadow-[#00B4D8]/10">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-space text-[28px] font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent uppercase leading-none">
                Lumenova
              </h1>
              <p className="text-[10px] text-[#00B4D8] font-bold tracking-[0.25em] uppercase mt-1">
                Stellar Testnet Payment DApp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 pulsing-dot-green"></span>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">Horizon Testnet</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 mt-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[56px] font-sf font-bold leading-tight tracking-tight text-white mb-5">
            <span className="bg-gradient-to-r from-[#00B4D8] to-[#0077FF] bg-clip-text text-transparent">Instant</span> XLM Transfers, Simpler Than Ever.
          </h2>
          <p className="text-[18px] text-slate-400 font-normal leading-relaxed opacity-70 max-w-2xl mx-auto">
            Lumenova connects directly to your Freighter wallet on the Stellar Testnet. 
            Check real-time balances, validate recipient keys, and sign transactions instantly.
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading && !isConnected ? (
          <div className="max-w-md mx-auto glass-card-premium p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-semibold">Initializing Freighter Connection...</p>
          </div>
        ) : (
          /* Uneven spacing between cards (18px, 34px, 48px mix) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[34px] items-start">
            {/* Left side: Connections & Wallet Details (Col span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-[18px]">
              <section aria-label="Wallet Connection Status">
                <WalletConnect wallet={wallet} />
              </section>

              {isConnected && (
                <section aria-label="Balance Information">
                  <BalanceCard wallet={wallet} />
                </section>
              )}

              {/* Wallet Error Banner */}
              {walletError && walletError !== 'Account not funded' && (
                <div className="glass-card-premium p-6 flex gap-4 items-start border-red-950/40">
                  <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-200 text-sm">Wallet Status Notification</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {walletError}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Payment forms & Results (Col span 7) with 48px gap displacement where appropriate */}
            <div className="lg:col-span-7 lg:pl-[14px]">
              {isConnected ? (
                <>
                  {txResult ? (
                    <TransactionResult 
                      result={txResult} 
                      onClear={() => setTxResult(null)} 
                    />
                  ) : (
                    <SendPaymentForm 
                      wallet={wallet} 
                      onTxSuccess={handleTxSuccess} 
                      onTxFailure={handleTxFailure} 
                    />
                  )}
                </>
              ) : (
                <div className="glass-card-premium h-[340px] flex flex-col items-center justify-center text-center p-10">
                  <div className="p-4 rounded-2xl bg-slate-900/60 text-slate-500 border border-slate-800/40 mb-4">
                    <Send className="w-10 h-10 text-[#00B4D8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-300">Payment Hub Locked</h3>
                    <p className="text-slate-500 text-sm max-w-sm mt-2 mx-auto leading-relaxed opacity-80">
                      Please connect your Freighter browser wallet on the left panel to begin sending payments on the Testnet network.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer with links made smaller and opacity 0.5 */}
      <footer className="max-w-6xl mx-auto px-6 mt-28 border-t border-slate-800/40 pt-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2.5 text-slate-500 text-xs opacity-50">
          <Cpu className="w-4 h-4 text-[#00B4D8]" />
          <span>Lumenova Stellar Payment Client • v1.0.0</span>
        </div>
        <div className="flex items-center gap-6 text-[11px] text-slate-500 font-semibold tracking-wider uppercase opacity-50">
          <a 
            href="https://horizon-testnet.stellar.org" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#00B4D8] hover:opacity-100 transition"
          >
            Horizon API
          </a>
          <a 
            href="https://stellar.expert/explorer/testnet/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#00B4D8] hover:opacity-100 transition"
          >
            Stellar Expert
          </a>
          <a 
            href="https://friendbot.stellar.org" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#00B4D8] hover:opacity-100 transition"
          >
            Friendbot Faucet
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
