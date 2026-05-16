import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeColors } from '../styles/useThemeColors';

export default function ProfileScreen({ onSync, syncing }) {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>Supabase connected ✅</Text>

      <Pressable
        style={[styles.btn, syncing && { opacity: 0.7 }]}
        onPress={onSync}
        disabled={syncing}
      >
        <Text style={styles.btnText}>{syncing ? 'Syncing…' : 'Sync now'}</Text>
      </Pressable>

      <Text style={styles.note}>Tip: Routines are saved in your Supabase table.</Text>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    title: { fontSize: 28, fontWeight: '900', color: colors.textPrimary, marginBottom: 8 },
    sub: { fontSize: 16, color: colors.textSecondary, fontWeight: '700' },
    btn: {
      marginTop: 16,
      backgroundColor: colors.accent,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 14,
    },
    btnText: { color: '#fff', fontWeight: '900' },
    note: { marginTop: 14, color: colors.mutedText, fontWeight: '700', textAlign: 'center' },
  });
}