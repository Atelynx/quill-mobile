import type {
  CurrencyRate,
  OrderRecord,
  PortfolioSummary,
  StockQuote,
  TradeRecord,
  UserProfile,
} from '../types/domain';

export const demoUser: UserProfile = {
  id: 'demo-user',
  fullName: 'Usuario Demo',
  email: 'demo@quill.local',
  availableBalance: 7425000,
  reservedBalance: 320000,
};

export const demoCurrencyRate: CurrencyRate = {
  symbol: 'USDCLP',
  rate: 935,
  basePrice: 930,
  dayChangePercentage: 0.54,
};

export const demoQuotes: StockQuote[] = [
  { symbol: 'COPEC.SN', name: 'Empresas Copec', currency: 'CLP', close: 7340, previousClose: 7210, dayChangePercentage: 1.8 },
  { symbol: 'CENCOSUD.SN', name: 'Cencosud', currency: 'CLP', close: 1885, previousClose: 1910, dayChangePercentage: -1.31 },
  { symbol: 'AAPL.US', name: 'Apple', currency: 'USD', close: 228.7, previousClose: 226.1, dayChangePercentage: 1.15 },
  { symbol: 'MSFT.US', name: 'Microsoft', currency: 'USD', close: 511.4, previousClose: 516.2, dayChangePercentage: -0.93 },
];

export const demoPortfolio: PortfolioSummary = {
  availableBalance: 7425000,
  reservedBalance: 320000,
  investedValue: 4873000,
  totalEquity: 12618000,
  unrealizedProfitLoss: 318000,
  positions: [
    {
      symbol: 'COPEC.SN',
      quantity: 420,
      reservedQuantity: 0,
      averageCost: 6950,
      marketPrice: 7340,
      marketValue: 3082800,
      unrealizedProfitLoss: 163800,
    },
    {
      symbol: 'AAPL.US',
      quantity: 9,
      reservedQuantity: 0,
      averageCost: 214.2,
      marketPrice: 228.7,
      marketValue: 2058.3,
      unrealizedProfitLoss: 130.5,
    },
  ],
};

export const demoOrders: OrderRecord[] = [
  {
    _id: 'ord-1001',
    symbol: 'CENCOSUD.SN',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 150,
    limitPrice: 1840,
    status: 'PENDING',
    createdAt: '2026-05-30T14:12:00.000Z',
  },
  {
    _id: 'ord-1000',
    symbol: 'COPEC.SN',
    side: 'SELL',
    type: 'MARKET',
    quantity: 25,
    status: 'EXECUTED',
    executionPrice: 7340,
    createdAt: '2026-05-29T17:40:00.000Z',
    executedAt: '2026-05-29T17:40:01.000Z',
  },
];

export const demoTrades: TradeRecord[] = [
  {
    _id: 'trd-9001',
    symbol: 'COPEC.SN',
    side: 'SELL',
    quantity: 25,
    executionPrice: 7340,
    grossAmount: 183500,
    commissionAmount: 918,
    netAmount: 182582,
    executedAt: '2026-05-29T17:40:01.000Z',
  },
];
