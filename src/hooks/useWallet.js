import { useState, useEffect, useCallback } from 'react';
import { 
  isConnected as freighterIsConnected, 
  isAllowed as freighterIsAllowed, 
  requestAccess, 
  getAddress,
  getNetworkDetails
} from '@stellar/freighter-api';
import { getAccountBalance } from '../services/stellarService';

export const useWallet = () => {
  const [state, setState] = useState({
    publicKey: null,
    balance: null,
    isConnected: false,
    isFreighterInstalled: false,
    network: null,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      const isInstalled = await freighterIsConnected();
      
      if (!isInstalled) {
        setState(s => ({ 
          ...s, 
          isFreighterInstalled: false, 
          isConnected: false,
          publicKey: null,
          balance: null,
        }));
        return;
      }

      let networkName = null;
      try {
        const networkDetails = await getNetworkDetails();
        if (networkDetails) {
          networkName = typeof networkDetails === 'string' ? networkDetails : networkDetails.network;
        }
      } catch (err) {
        console.error('Error fetching network details:', err);
      }
      
      const isAllowed = await freighterIsAllowed();
      
      if (isAllowed) {
        const addressResult = await getAddress();
        const publicKey = typeof addressResult === 'string' ? addressResult : addressResult?.address;
        
        if (!publicKey) {
          setState({
            publicKey: null,
            balance: null,
            isConnected: false,
            isFreighterInstalled: true,
            network: networkName,
            error: 'Failed to retrieve wallet public key.',
          });
          return;
        }

        let balance = null;
        let error = null;
        try {
          balance = await getAccountBalance(publicKey);
        } catch (e) {
          error = e.message; // e.g. "Account not funded"
        }

        setState({
          publicKey,
          balance,
          isConnected: true,
          isFreighterInstalled: true,
          network: networkName,
          error,
        });
      } else {
        setState(s => ({ 
          ...s, 
          isFreighterInstalled: true, 
          isConnected: false, 
          publicKey: null, 
          balance: null,
          network: networkName,
        }));
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setState(s => ({ ...s, error: error.message }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connect = async () => {
    try {
      setIsLoading(true);
      setState(s => ({ ...s, error: null }));
      
      const isInstalled = await freighterIsConnected();
      if (!isInstalled) {
        setState(s => ({ ...s, isFreighterInstalled: false, error: 'Freighter extension is not installed.' }));
        return;
      }

      const access = await requestAccess();
      if (access) {
        await checkConnection();
      } else {
        setState(s => ({ ...s, error: 'Connection request rejected by user.' }));
      }
    } catch (error) {
      setState(s => ({ ...s, error: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    // Clear local state to simulate disconnect
    setState({
      publicKey: null,
      balance: null,
      isConnected: false,
      isFreighterInstalled: true,
      network: null,
      error: null,
    });
  };

  const refreshBalance = async () => {
    if (state.publicKey) {
      try {
        const balance = await getAccountBalance(state.publicKey);
        setState(s => ({ ...s, balance, error: null }));
      } catch (e) {
        setState(s => ({ ...s, balance: null, error: e.message }));
      }
    }
  };

  return {
    ...state,
    isLoading,
    connect,
    disconnect,
    refreshBalance,
    checkConnection,
  };
};
