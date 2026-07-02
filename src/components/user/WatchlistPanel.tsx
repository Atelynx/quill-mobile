import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Card } from '../Card';
import { EmptyState } from '../EmptyState';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { useAppSession } from '../../state/AppSessionContext';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeTokens } from '../../theme/palette';

export const WatchlistPanel = () => {
  const session = useAppSession();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [symbol, setSymbol] = useState('');
  const [feedback, setFeedback] = useState<string>();
  const resource = useAsyncResource(() => session.repository.getWatchlist(), [session.repository]);
  const refreshWatchlist = resource.refresh;

  useFocusEffect(useCallback(() => {
    void refreshWatchlist();
  }, [refreshWatchlist]));

  const addSymbol = async () => {
    if (!symbol.trim()) {
      setFeedback('Ingresa un símbolo para seguir.');
      return;
    }
    await mutate(async () => {
      const result = await session.repository.addToWatchlist([symbol.trim().toUpperCase()]);
      setSymbol('');
      if (session.session?.user) {
        await session.updateSessionUser({ ...session.session.user, watchlist: result.watchlist });
      }
      await resource.refresh();
      return 'Símbolo agregado al seguimiento.';
    });
  };

  const removeSymbol = async (value: string) => {
    await mutate(async () => {
      const result = await session.repository.removeFromWatchlist(value);
      if (session.session?.user) {
        await session.updateSessionUser({ ...session.session.user, watchlist: result.watchlist });
      }
      await resource.refresh();
      return 'Símbolo quitado del seguimiento.';
    });
  };

  const mutate = async (action: () => Promise<string>) => {
    try {
      setFeedback(await action());
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No fue posible actualizar watchlist.');
    }
  };

  return (
    <Card>
      <Text style={styles.section}>Watchlist</Text>
      <View style={styles.row}>
        <TextInput
          value={symbol}
          onChangeText={setSymbol}
          autoCapitalize="characters"
          placeholder="Símbolo"
          placeholderTextColor={theme.muted}
          style={styles.input}
        />
        <Pressable accessibilityRole="button" onPress={() => void addSymbol()} style={styles.button}>
          <Text style={styles.buttonText}>Seguir</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>Usa símbolos exactos del mercado, por ejemplo AAPL.US o COPEC.SN.</Text>
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      {resource.loading ? <Text style={styles.feedback}>Cargando watchlist...</Text> : null}
      {resource.data?.length === 0 ? <EmptyState title="Sin símbolos" message="Agrega activos desde Mercado." /> : null}
      {resource.data?.map((quote) => (
        <View key={quote.symbol} style={styles.item}>
          <View style={styles.info}>
            <Text style={styles.symbol}>{quote.symbol}</Text>
            <Text style={styles.name}>{quote.name}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => void removeSymbol(quote.symbol)} style={styles.remove}>
            <Text style={styles.removeText}>Quitar</Text>
          </Pressable>
        </View>
      ))}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </Card>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  section: { color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.text,
    flex: 1,
    padding: 11,
  },
  button: { backgroundColor: theme.primary, borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  buttonText: { color: theme.surface, fontWeight: '700' },
  item: { alignItems: 'center', borderTopColor: theme.border, borderTopWidth: 1, flexDirection: 'row', paddingVertical: 10 },
  info: { flex: 1 },
  symbol: { color: theme.text, fontWeight: '800' },
  name: { color: theme.muted, marginTop: 2 },
  remove: { backgroundColor: theme.surfaceMuted, borderRadius: 8, padding: 8 },
  removeText: { color: theme.danger, fontWeight: '700' },
  feedback: { color: theme.muted, marginTop: 10 },
  hint: { color: theme.muted, fontSize: 12, marginTop: 8 },
  error: { color: theme.danger, marginTop: 10 },
});
