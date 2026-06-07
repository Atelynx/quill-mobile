import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../Card';
import { EmptyState } from '../EmptyState';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { useAppSession } from '../../state/AppSessionContext';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeTokens } from '../../theme/palette';

export const SocialPanel = () => {
  const session = useAppSession();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState<string>();
  const resource = useAsyncResource(async () => ({
    friends: await session.repository.getFriends(),
    requests: await session.repository.getFriendRequests(),
  }), [session.repository]);
  const requests = resource.data?.requests ?? [];
  const filteredFriends = useMemo(
    () => (resource.data?.friends ?? []).filter((friend) => matchesFriend(friend, query)),
    [resource.data?.friends, query],
  );

  const sendRequest = async () => {
    if (!query.trim()) {
      setFeedback('Ingresa un ID de usuario para enviar solicitud.');
      return;
    }
    await mutate(async () => {
      const response = await session.repository.sendFriendRequest(query.trim());
      setQuery('');
      return response.message;
    });
  };

  const answerRequest = async (userId: string, accept: boolean) => {
    await mutate(async () => {
      const response = accept
        ? await session.repository.acceptFriendRequest(userId)
        : await session.repository.rejectFriendRequest(userId);
      await resource.refresh();
      return response.message;
    });
  };

  const removeFriend = async (userId: string) => {
    await mutate(async () => {
      const response = await session.repository.removeFriend(userId);
      await resource.refresh();
      return response.message;
    });
  };

  const mutate = async (action: () => Promise<string>) => {
    try {
      setFeedback(await action());
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No fue posible actualizar amigos.');
    }
  };

  return (
    <Card>
      <Text style={styles.section}>Amigos</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        placeholder="ID, email o username"
        placeholderTextColor={theme.muted}
        style={styles.input}
      />
      <Pressable accessibilityRole="button" onPress={() => void sendRequest()} style={styles.button}>
        <Text style={styles.buttonText}>Enviar solicitud</Text>
      </Pressable>
      <Text style={styles.subsection}>Solicitudes</Text>
      {requests.length === 0 ? <EmptyState title="Sin solicitudes" message="No hay solicitudes pendientes." /> : null}
      {requests.map((request) => (
        <View key={request._id} style={styles.item}>
          <FriendInfo name={request.from.fullName} detail={request.from.username ?? request.from.email} />
          <View style={styles.actions}>
            <MiniButton label="Aceptar" onPress={() => void answerRequest(request.from._id, true)} />
            <MiniButton label="Rechazar" onPress={() => void answerRequest(request.from._id, false)} danger />
          </View>
        </View>
      ))}
      <Text style={styles.subsection}>Lista</Text>
      {filteredFriends.length === 0 ? <EmptyState title="Sin resultados" message="No hay amigos para mostrar." /> : null}
      {filteredFriends.map((friend) => (
        <View key={friend._id} style={styles.item}>
          <FriendInfo name={friend.fullName} detail={friend.username ?? friend.email} />
          <MiniButton label="Quitar" onPress={() => void removeFriend(friend._id)} danger />
        </View>
      ))}
      {resource.error ? <Text style={styles.error}>{resource.error}</Text> : null}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </Card>
  );
};

const matchesFriend = (friend: { fullName: string; email: string; username?: string | null }, query: string) => {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  return [friend.fullName, friend.email, friend.username ?? ''].some((value) => value.toLowerCase().includes(term));
};

const FriendInfo = ({ name, detail }: { name: string; detail: string }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.info}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
};

const MiniButton = ({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.mini}>
      <Text style={[styles.miniText, danger && styles.danger]}>{label}</Text>
    </Pressable>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  section: { color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 },
  subsection: { color: theme.text, fontWeight: '800', marginTop: 14 },
  input: { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: 8, borderWidth: 1, color: theme.text, padding: 11 },
  button: { backgroundColor: theme.primary, borderRadius: 8, marginTop: 8, padding: 11 },
  buttonText: { color: theme.surface, fontWeight: '700', textAlign: 'center' },
  item: { alignItems: 'center', borderTopColor: theme.border, borderTopWidth: 1, flexDirection: 'row', gap: 8, paddingVertical: 10 },
  info: { flex: 1 },
  actions: { flexDirection: 'row', gap: 6 },
  name: { color: theme.text, fontWeight: '800' },
  detail: { color: theme.muted, marginTop: 2 },
  mini: { backgroundColor: theme.surfaceMuted, borderRadius: 8, padding: 8 },
  miniText: { color: theme.primary, fontWeight: '700' },
  danger: { color: theme.danger },
  feedback: { color: theme.muted, marginTop: 10 },
  error: { color: theme.danger, marginTop: 10 },
});
