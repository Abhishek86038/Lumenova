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
    <div className="relative min-h-screen bg-[#080b11] text-slate-100 bg-grid-pattern pb-16 overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '3s' }}></div>

      {/* Main Header / Navigation */}
      <header className="border-b border-slate-800/60 bg-[#080b11]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent uppercase">
                Lumenova
              </h1>
              <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">
                Stellar Testnet Payment dApp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">Horizon Testnet</span>
          </div>
        </div>
      </header>

      {/* Hero / Main Area */}
      <main className="max-w-6xl mx-auto px-4 mt-10">
        {/* Intro Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
            Instant XLM Transfers, Simpler Than Ever.
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Lumenova connects directly to your Freighter wallet on the Stellar Testnet. 
            Check real-time balances, validate recipient keys, and sign transactions instantly.
          </p>
        </div>

        {/* Loading Overlay for App Initializer */}
        {isLoading && !isConnected ? (
          <div className="max-w-md mx-auto bg-[#121620]/60 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 glow-indigo">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-semibold">Initializing Freighter Connection...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Connections & Wallet Details (Col span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
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
                <div className="bg-[#121620] border border-red-950/40 rounded-2xl p-5 glow-danger backdrop-blur-md flex gap-3.5 items-start">
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

            {/* Right side: Payment forms & Results (Col span 7) */}
            <div className="lg:col-span-7">
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
                <div className="bg-[#121620]/50 border border-slate-800/50 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-4 backdrop-blur-md">
                  <div className="p-4 rounded-full bg-slate-800/40 text-slate-500">
                    <Send className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-300">Payment Hub Locked</h3>
                    <p className="text-slate-500 text-sm max-w-sm mt-1 mx-auto leading-relaxed">
                      Please connect your Freighter browser wallet on the left panel to begin sending payments on the Testnet network.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 mt-20 border-t border-slate-800/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Cpu className="w-4 h-4 text-indigo-500/80" />
          <span>Lumenova Stellar Payment Client • v1.0.0</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
          <a 
            href="https://horizon-testnet.stellar.org" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-indigo-400 transition"
          >
            Horizon API
          </a>
          <a 
            href="https://stellar.expert/explorer/testnet/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-indigo-400 transition"
          >
            Stellar Expert
          </a>
          <a 
            href="https://friendbot.stellar.org" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-indigo-400 transition"
          >
            Friendbot Faucet
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
