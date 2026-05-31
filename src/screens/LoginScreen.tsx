import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import { useAppSession } from '../state/AppSessionContext';

export const LoginScreen = () => {
  const { login, mode } = useAppSession();
  const [email, setEmail] = useState('demo@quill.cl');
  const [password, setPassword] = useState('qwerty123');
  const [error, setError] = useState<string>();

  const submit = async () => {
    setError(undefined);
    try {
      await login(email, password);
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'No fue posible iniciar sesión.';
      setError(message);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Text style={styles.brand}>Quill</Text>
      <Text style={styles.title}>Invierte y revisa tu portafolio desde Android.</Text>
      <Text style={styles.mode}>{mode === 'mock' ? 'Modo demo local' : 'Backend real configurado'}</Text>
      <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Pressable accessibilityRole="button" onPress={() => void submit()} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: 22 },
  brand: { color: colors.primary, fontSize: 34, fontWeight: '800', marginBottom: 8 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 10 },
  mode: { color: colors.muted, marginBottom: 24 },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: 15 },
  buttonText: { color: colors.surface, fontWeight: '700', textAlign: 'center' },
  error: { color: colors.danger, marginTop: 12 },
});
