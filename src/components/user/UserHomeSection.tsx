import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../Card';
import { ProfileSummary } from './ProfileSummary';
import { useTheme } from '../../theme/ThemeContext';
import type { ThemeTokens } from '../../theme/palette';
import type { UserProfile } from '../../types/domain';

export type UserSection = 'home' | 'profile' | 'settings' | 'watchlist' | 'friends';

interface UserHomeSectionProps {
  user?: UserProfile;
  onOpen: (section: UserSection) => void;
}

const sections: { id: UserSection; title: string; description: string }[] = [
  { id: 'profile', title: 'Perfil', description: 'Datos personales y username.' },
  { id: 'settings', title: 'Configuración', description: 'Tema, moneda, correo y contraseña.' },
  { id: 'watchlist', title: 'Watchlist', description: 'Símbolos seguidos y acceso rápido.' },
  { id: 'friends', title: 'Amigos', description: 'Contactos y solicitudes pendientes.' },
];

export const UserHomeSection = ({ user, onOpen }: UserHomeSectionProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  return (
    <View>
      <ProfileSummary user={user} />
      {sections.map((section) => (
        <Card key={section.id}>
          <Pressable accessibilityRole="button" onPress={() => onOpen(section.id)} style={styles.item}>
            <View style={styles.itemText}>
              <Text style={styles.title}>{section.title}</Text>
              <Text style={styles.description}>{section.description}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </Card>
      ))}
    </View>
  );
};

const createStyles = (theme: ThemeTokens) => StyleSheet.create({
  item: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  itemText: { flex: 1 },
  title: { color: theme.text, fontSize: 16, fontWeight: '800' },
  description: { color: theme.muted, marginTop: 4 },
  arrow: { color: theme.primary, fontSize: 24, fontWeight: '700' },
});
