import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SegmentedControl } from './SegmentedControl';
import { estimateQuantityFromAmount } from '../services/orderAmount';
import { validateOrderInput } from '../services/orderValidation';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';
import type { CreateOrderInput, OrderSide, OrderType, StockQuote } from '../types/domain';
import { formatMoney } from '../utils/money';

interface OrderFormProps {
  onSubmit: (input: CreateOrderInput) => Promise<void>;
  quotes: StockQuote[];
  rate: number;
}

export const OrderForm = ({ onSubmit, quotes, rate }: OrderFormProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [symbol, setSymbol] = useState(quotes[0]?.symbol ?? 'COPEC.SN');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('LIMIT');
  const [buyMode, setBuyMode] = useState<'quantity' | 'amount'>('quantity');
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('1000');
  const [feedback, setFeedback] = useState<string>();
  const selectedQuote = quotes.find((quote) => quote.symbol === symbol);
  const referencePrice = type === 'LIMIT' ? Number(limitPrice) : selectedQuote?.close ?? 0;
  const amountEstimate = estimateQuantityFromAmount(amount, referencePrice);

  useEffect(() => {
    if (!selectedQuote && quotes[0]) {
      setSymbol(quotes[0].symbol);
    }
    if (selectedQuote && type === 'LIMIT') {
      setLimitPrice(String(selectedQuote.close));
    }
  }, [quotes, selectedQuote, type]);

  const submit = async () => {
    const nextQuantity = side === 'BUY' && buyMode === 'amount'
      ? String(amountEstimate.quantity)
      : quantity;
    if (side === 'BUY' && buyMode === 'amount' && !amountEstimate.enoughForOne) {
      setFeedback('El monto no alcanza para comprar 1 acción.');
      return;
    }
    const result = validateOrderInput({
      symbol,
      side,
      type,
      quantity: nextQuantity,
      limitPrice: type === 'LIMIT' ? limitPrice : undefined,
    });
    if (!result.success) {
      setFeedback(result.errors[0]);
      return;
    }
    try {
      await onSubmit(result.data);
      setFeedback(type === 'MARKET' ? 'Orden enviada a mercado.' : 'Orden límite registrada.');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No fue posible registrar la orden.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Símbolo</Text>
      <View style={styles.symbols}>
        {quotes.map((quote) => (
          <Pressable key={quote.symbol} onPress={() => setSymbol(quote.symbol)} style={styles.symbolButton}>
            <Text style={[styles.symbolText, symbol === quote.symbol && styles.activeSymbol]}>{quote.symbol}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput value={symbol} onChangeText={setSymbol} autoCapitalize="characters" style={styles.input} />
      {selectedQuote ? (
        <Text style={styles.hint}>
          Precio ref. {formatMoney(selectedQuote.close, selectedQuote.currency)}
          {selectedQuote.currency === 'CLP' ? ` · ${formatMoney(selectedQuote.close / rate, 'USD')}` : ''}
        </Text>
      ) : null}
      <SegmentedControl values={['BUY', 'SELL']} value={side} onChange={setSide} />
      <SegmentedControl values={['LIMIT', 'MARKET']} value={type} onChange={setType} />
      {side === 'BUY' ? (
        <SegmentedControl
          values={['quantity', 'amount']}
          value={buyMode}
          onChange={setBuyMode}
          labels={{ quantity: 'Comprar por cantidad', amount: 'Comprar por monto' }}
        />
      ) : null}
      {side === 'BUY' && buyMode === 'amount' ? (
        <>
          <Text style={styles.label}>Monto a invertir</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
          <Text style={styles.hint}>
            Cantidad estimada: {amountEstimate.quantity} · Costo estimado {formatMoney(amountEstimate.estimatedCost, selectedQuote?.currency ?? 'CLP')}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.label}>Cantidad</Text>
          <TextInput value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.input} />
        </>
      )}
      {type === 'LIMIT' ? (
        <>
          <Text style={styles.label}>Precio límite</Text>
          <TextInput value={limitPrice} onChangeText={setLimitPrice} keyboardType="numeric" style={styles.input} />
        </>
      ) : null}
      <Pressable accessibilityRole="button" onPress={() => void submit()} style={styles.button}>
        <Text style={styles.buttonText}>Crear orden</Text>
      </Pressable>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  container: { gap: 8 },
  label: { color: theme.muted, fontSize: 12, fontWeight: '700' },
  input: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.text,
    padding: 12,
  },
  button: { backgroundColor: theme.primary, borderRadius: 8, marginTop: 4, padding: 13 },
  buttonText: { color: theme.surface, fontWeight: '700', textAlign: 'center' },
  feedback: { color: theme.muted, fontSize: 13 },
  hint: { color: theme.muted, fontSize: 12 },
  symbols: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symbolButton: { backgroundColor: theme.surfaceMuted, borderRadius: 8, padding: 8 },
  symbolText: { color: theme.muted, fontSize: 12, fontWeight: '700' },
  activeSymbol: { color: theme.primary },
});
