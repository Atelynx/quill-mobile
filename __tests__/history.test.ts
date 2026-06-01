import { buildDemoHistory, normalizeHistory } from '../src/utils/history';
import { demoQuotes } from '../src/mocks/demoData';

describe('history utils', () => {
  it('crea historial mock ordenado para gráfico', () => {
    const history = buildDemoHistory(demoQuotes[0], 6);

    expect(history).toHaveLength(6);
    expect(history[0].symbol).toBe(demoQuotes[0].symbol);
  });

  it('normaliza puntos por fecha ascendente', () => {
    const result = normalizeHistory([
      { symbol: 'AAPL.US', price: 2, createdAt: '2026-01-02T00:00:00.000Z' },
      { symbol: 'AAPL.US', price: 1, createdAt: '2026-01-01T00:00:00.000Z' },
    ]);

    expect(result.map((item) => item.price)).toEqual([1, 2]);
  });
});
