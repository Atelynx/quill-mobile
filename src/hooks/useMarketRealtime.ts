import { useEffect, useMemo, useState } from 'react';
import { createRealtimeClient } from '../services/realtimeService';
import type { CurrencyRate, StockQuote } from '../types/domain';
import { applyCurrencyUpdate, applyMarketUpdate } from '../utils/realtimeUpdates';

interface MarketRealtimeInput {
  accessToken?: string;
  mode: 'mock' | 'backend';
}

export const useMarketRealtime = ({ accessToken, mode }: MarketRealtimeInput) => {
  const [liveQuotes, setLiveQuotes] = useState<StockQuote[]>([]);
  const [liveRate, setLiveRate] = useState<CurrencyRate>();
  const [socketStatus, setSocketStatus] = useState('Actualización manual disponible');
  const subscriptionSymbols = useMemo(() => liveQuotes.map((quote) => quote.symbol).join('|'), [liveQuotes]);

  useEffect(() => {
    if (mode !== 'backend' || !accessToken || !subscriptionSymbols) {
      return undefined;
    }

    const client = createRealtimeClient(accessToken, {
      onStatus: (status) =>
        setSocketStatus(status === 'connected' ? 'Tiempo real conectado' : 'Actualización manual disponible'),
      onPrice: (event) => {
        if (event.symbol === 'USDCLP') {
          setLiveRate((current) => (current ? applyCurrencyUpdate(current, event) : current));
          return;
        }
        setLiveQuotes((current) => applyMarketUpdate(current, event));
      },
    });

    subscriptionSymbols.split('|').forEach((symbol) => client.subscribeStock(symbol));
    client.subscribeForex('USDCLP');
    return () => client.disconnect();
  }, [accessToken, mode, subscriptionSymbols]);

  return { liveQuotes, liveRate, setLiveQuotes, setLiveRate, socketStatus };
};
