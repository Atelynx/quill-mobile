import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { StatusBanner } from '../components/StatusBanner';
import { AccountSettingsCard } from '../components/user/AccountSettingsCard';
import { ProfileEditCard } from '../components/user/ProfileEditCard';
import { ProfileSummary } from '../components/user/ProfileSummary';
import { SocialPanel } from '../components/user/SocialPanel';
import { UserHomeSection, type UserSection } from '../components/user/UserHomeSection';
import { UserSectionHeader } from '../components/user/UserSectionHeader';
import { WatchlistPanel } from '../components/user/WatchlistPanel';
import { useAsyncResource } from '../hooks/useAsyncResource';
import { useAppSession } from '../state/AppSessionContext';
import { useLayoutStyles } from '../styles/layout';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeTokens } from '../theme/palette';

export const UserScreen = () => {
  const session = useAppSession();
  const layoutStyles = useLayoutStyles();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [section, setSection] = useState<UserSection>('home');
  const status = useAsyncResource(
    () => session.repository.getConnectionStatus(),
    [session.repository],
  );
  const profile = useAsyncResource(async () => {
    const user = await session.repository.getProfile();
    await session.updateSessionUser(user);
    return user;
  }, [session.repository]);
  const goHome = () => setSection('home');
  const user = profile.data ?? session.session?.user;

  return (
    <ScrollView style={layoutStyles.screen}>
      {section === 'home' ? (
        <>
          <Text style={layoutStyles.title}>Usuario</Text>
          <Text style={layoutStyles.subtitle}>Centro de cuenta y secciones</Text>
        </>
      ) : null}
      <StatusBanner
        mode={session.mode}
        message={status.data === 'ok' ? 'Origen disponible' : 'Origen sin respuesta'}
      />
      {profile.error ? <Text style={styles.error}>{profile.error}</Text> : null}
      {section === 'home' ? <UserHomeSection user={user} onOpen={setSection} /> : null}
      {section === 'profile' ? (
        <>
          <UserSectionHeader title="Perfil" subtitle="Datos visibles de tu cuenta" onBack={goHome} />
          {profile.loading ? <Text style={styles.muted}>Cargando perfil...</Text> : null}
          <ProfileSummary user={user} />
          <ProfileEditCard user={user} />
        </>
      ) : null}
      {section === 'settings' ? (
        <>
          <UserSectionHeader title="Configuración" subtitle="Preferencias y credenciales" onBack={goHome} />
          <AccountSettingsCard />
          <Pressable accessibilityRole="button" onPress={session.logout} style={styles.button}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </Pressable>
        </>
      ) : null}
      {section === 'watchlist' ? (
        <>
          <UserSectionHeader title="Watchlist" subtitle="Activos en seguimiento" onBack={goHome} />
          <WatchlistPanel />
        </>
      ) : null}
      {section === 'friends' ? (
        <>
          <UserSectionHeader title="Amigos" subtitle="Contactos y solicitudes" onBack={goHome} />
          <SocialPanel />
        </>
      ) : null}
    </ScrollView>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  button: { backgroundColor: theme.danger, borderRadius: 8, marginBottom: 24, padding: 14 },
  buttonText: { color: theme.surface, fontWeight: '700', textAlign: 'center' },
  error: { color: theme.danger, marginVertical: 10 },
  muted: { color: theme.muted, marginBottom: 10 },
});
