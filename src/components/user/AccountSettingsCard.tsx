import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card } from '../Card';
import { CurrencySwitch } from '../CurrencySwitch';
import { ThemeSelector } from '../ThemeSelector';
import { useAppSession } from '../../state/AppSessionContext';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeTokens } from '../../theme/palette';

export const AccountSettingsCard = () => {
  const session = useAppSession();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const user = session.session?.user;
  const [newEmail, setNewEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState<string>();

  const saveEmail = async () => {
    await runAction(async () => {
      await session.repository.changeEmail({ currentPassword, newEmail });
      setCurrentPassword('');
      return 'Correo actualizado. Vuelve a iniciar sesión si el backend lo solicita.';
    }, setFeedback);
  };

  const savePassword = async () => {
    await runAction(async () => {
      await session.repository.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      return 'Contraseña actualizada.';
    }, setFeedback);
  };

  return (
    <Card>
      <Text style={styles.section}>Configuración</Text>
      <Text style={styles.label}>Moneda preferida</Text>
      <CurrencySwitch value={session.preferredCurrency} onChange={session.setPreferredCurrency} />
      <Text style={styles.label}>Tema visual</Text>
      <ThemeSelector />
      <View style={styles.divider} />
      <Text style={styles.label}>Nuevo correo</Text>
      <TextInput value={newEmail} onChangeText={setNewEmail} keyboardType="email-address" style={styles.input} />
      <Text style={styles.label}>Contraseña actual</Text>
      <TextInput value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry style={styles.input} />
      <ActionButton label="Cambiar correo" onPress={() => void saveEmail()} />
      <Text style={styles.label}>Nueva contraseña</Text>
      <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.input} />
      <ActionButton label="Cambiar contraseña" onPress={() => void savePassword()} />
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </Card>
  );
};

const runAction = async (action: () => Promise<string>, setFeedback: (value: string) => void) => {
  try {
    setFeedback(await action());
  } catch (error) {
    setFeedback(error instanceof Error ? error.message : 'No fue posible completar la acción.');
  }
};

const ActionButton = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.action}>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
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
  divider: { backgroundColor: theme.border, height: 1, marginVertical: 12 },
  action: { backgroundColor: theme.primary, borderRadius: 8, marginTop: 10, padding: 11 },
  actionText: { color: theme.surface, fontWeight: '700', textAlign: 'center' },
  feedback: { color: theme.muted, marginTop: 10 },
});
