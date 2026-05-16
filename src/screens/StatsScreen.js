import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAtomValue } from 'jotai';
import { routinesStatsAtom } from '../store/atoms';
import { useThemeColors } from '../styles/useThemeColors';

export default function StatsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { total, done, remaining, percent } = useAtomValue(routinesStatsAtom);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stats</Text>
      <Text style={styles.subtext}>Your routines progress summary.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>{total}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completed</Text>
        <Text style={styles.value}>{done}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Remaining</Text>
        <Text style={styles.value}>{remaining}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completion</Text>
        <Text style={styles.value}>{percent}%</Text>
      </View>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 18 },
    heading: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
    subtext: { marginTop: 6, marginBottom: 14, fontSize: 14, color: colors.textSecondary, fontWeight: '700' },

    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 14,
      marginBottom: 10,
    },
    label: { fontWeight: '800', color: colors.textSecondary },
    value: { marginTop: 6, fontSize: 26, fontWeight: '900', color: colors.accent },
  });
}