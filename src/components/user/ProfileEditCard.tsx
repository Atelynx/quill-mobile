import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Card } from '../Card';
import { useAppSession } from '../../state/AppSessionContext';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeTokens } from '../../theme/palette';

export const ProfileEditCard = () => {
  const session = useAppSession();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const user = session.session?.user;
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [feedback, setFeedback] = useState<string>();

  const saveProfile = async () => {
    try {
      const updated = await session.repository.updateProfile({ fullName, username: username || undefined });
      await session.updateSessionUser(updated);
      setFeedback('Perfil actualizado.');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No fue posible actualizar el perfil.');
    }
  };

  return (
    <Card>
      <Text style={styles.section}>Editar perfil</Text>
      <Text style={styles.label}>Nombre completo</Text>
      <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />
      <Text style={styles.label}>Username</Text>
      <TextInput value={username ?? ''} onChangeText={setUsername} autoCapitalize="none" style={styles.input} />
      <Pressable accessibilityRole="button" onPress={() => void saveProfile()} style={styles.action}>
        <Text style={styles.actionText}>Guardar perfil</Text>
      </Pressable>
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </Card>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  section: { color: theme.text, fontSize: 16, fontWeight: '800', marginBottom: 10 },
  label: { color: theme.muted, fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.text,
    padding: 11,
  },
  action: { backgroundColor: theme.primary, borderRadius: 8, marginTop: 10, padding: 11 },
  actionText: { color: theme.surface, fontWeight: '700', textAlign: 'center' },
  feedback: { color: theme.muted, marginTop: 10 },
});
