import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppSession } from '../state/AppSessionContext';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';

export const LoginScreen = () => {
  const { lastEmail, login, mode, register } = useAppSession();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [modeForm, setModeForm] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(lastEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [info, setInfo] = useState<string>();

  useEffect(() => {
    setEmail((current) => current || lastEmail);
  }, [lastEmail]);

  const submit = async () => {
    setError(undefined);
    setInfo(undefined);
    if (!email.trim() || !password) {
      setError('Ingresa correo y contraseña.');
      return;
    }
    try {
      if (modeForm === 'login') {
        await login(email.trim(), password);
        return;
      }
      const result = await register({ fullName, email: email.trim(), password, username });
      setInfo(result.message);
      setPassword('');
      setModeForm('login');
    } catch (actionError) {
      const message = actionError instanceof Error ? actionError.message : 'No fue posible completar la solicitud.';
      setError(message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0} style={styles.screen}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
      >
        <Text style={styles.brand}>Quill</Text>
        <Text style={styles.title}>Invierte y revisa tu portafolio desde Android.</Text>
        <Text style={styles.mode}>
          {mode === 'mock'
            ? 'Modo demo local'
            : mode === 'backend-fallback'
              ? 'Backend con respaldo demo para mercado'
              : 'Backend real configurado'}
        </Text>
        <View style={styles.segment}>
          <Tab label="Entrar" active={modeForm === 'login'} onPress={() => setModeForm('login')} />
          <Tab label="Crear cuenta" active={modeForm === 'register'} onPress={() => setModeForm('register')} />
        </View>
        {modeForm === 'register' ? (
          <>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nombre completo"
              placeholderTextColor={theme.muted}
              style={styles.input}
            />
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="Username opcional"
              placeholderTextColor={theme.muted}
              style={styles.input}
            />
          </>
        ) : null}
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Correo"
          placeholderTextColor={theme.muted}
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          placeholderTextColor={theme.muted}
          secureTextEntry
          style={styles.input}
        />
        <Pressable accessibilityRole="button" onPress={() => void submit()} style={styles.button}>
          <Text style={styles.buttonText}>{modeForm === 'login' ? 'Entrar' : 'Crear cuenta'}</Text>
        </Pressable>
        {info ? <Text style={styles.info}>{info}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Tab = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.activeTab]}>
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  screen: { backgroundColor: theme.background, flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 22, paddingBottom: 96 },
  brand: { color: theme.primary, fontSize: 34, fontWeight: '800', marginBottom: 8 },
  title: { color: theme.text, fontSize: 22, fontWeight: '700', marginBottom: 10 },
  mode: { color: theme.muted, marginBottom: 18 },
  segment: { backgroundColor: theme.surfaceMuted, borderRadius: 8, flexDirection: 'row', marginBottom: 14, padding: 3 },
  tab: { borderRadius: 6, flex: 1, padding: 10 },
  activeTab: { backgroundColor: theme.primary },
  tabText: { color: theme.muted, fontWeight: '700', textAlign: 'center' },
  activeTabText: { color: theme.surface },
  input: {
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderRadius: 8,
    borderWidth: 1,
    color: theme.text,
    marginBottom: 12,
    padding: 14,
  },
  button: { backgroundColor: theme.primary, borderRadius: 8, padding: 15 },
  buttonText: { color: theme.surface, fontWeight: '700', textAlign: 'center' },
  info: { color: theme.success, marginTop: 12 },
  error: { color: theme.danger, marginTop: 12 },
});
