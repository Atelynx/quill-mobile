import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';
import { validateOrderInput } from '../services/orderValidation';
import type { CreateOrderInput, OrderSide, OrderType } from '../types/domain';

interface OrderFormProps {
  onSubmit: (input: CreateOrderInput) => Promise<void>;
}

export const OrderForm = ({ onSubmit }: OrderFormProps) => {
  const [symbol, setSymbol] = useState('COPEC.SN');
  const [side, setSide] = useState<OrderSide>('BUY');
  const [type, setType] = useState<OrderType>('LIMIT');
  const [quantity, setQuantity] = useState('1');
  const [limitPrice, setLimitPrice] = useState('1000');
  const [feedback, setFeedback] = useState<string>();

  const submit = async () => {
    const result = validateOrderInput({
      symbol,
      side,
      type,
      quantity,
      limitPrice: type === 'LIMIT' ? limitPrice : undefined,
    });
    if (!result.success) {
      setFeedback(result.errors[0]);
      return;
    }
    await onSubmit(result.data);
    setFeedback('Orden registrada correctamente.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Símbolo</Text>
      <TextInput value={symbol} onChangeText={setSymbol} autoCapitalize="characters" style={styles.input} />
      <Segment values={['BUY', 'SELL']} value={side} onChange={setSide} />
      <Segment values={['LIMIT', 'MARKET']} value={type} onChange={setType} />
      <Text style={styles.label}>Cantidad</Text>
      <TextInput value={quantity} onChangeText={setQuantity} keyboardType="numeric" style={styles.input} />
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

interface SegmentProps<T extends string> {
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

const Segment = <T extends string>({ values, value, onChange }: SegmentProps<T>) => (
  <View style={styles.segment}>
    {values.map((item) => (
      <Pressable key={item} onPress={() => onChange(item)} style={[styles.segmentItem, value === item && styles.active]}>
        <Text style={[styles.segmentText, value === item && styles.activeText]}>{item}</Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    padding: 12,
  },
  segment: { flexDirection: 'row', gap: 8, marginVertical: 4 },
  segmentItem: { backgroundColor: colors.surfaceMuted, borderRadius: 8, flex: 1, padding: 10 },
  active: { backgroundColor: colors.primary },
  segmentText: { color: colors.muted, fontWeight: '700', textAlign: 'center' },
  activeText: { color: colors.surface },
  button: { backgroundColor: colors.primary, borderRadius: 8, marginTop: 4, padding: 13 },
  buttonText: { color: colors.surface, fontWeight: '700', textAlign: 'center' },
  feedback: { color: colors.muted, fontSize: 13 },
});
