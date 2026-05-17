import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAtomValue } from 'jotai';
import { routinesStatsAtom } from '../store/atoms';
import { useThemeColors } from '../styles/useThemeColors';

export default function StatsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { total, done, remaining, percent } = useAtomValue(routinesStatsAtom);

  const statCards = [
    {
      label: 'Total Routines',
      value: total,
      icon: '📋',
      fill: total > 0 ? 100 : 0,
      color: colors.accent,
    },
    {
      label: 'Completed',
      value: done,
      icon: '✅',
      fill: total > 0 ? Math.round((done / total) * 100) : 0,
      color: '#34C38F',
    },
    {
      label: 'Remaining',
      value: remaining,
      icon: '⏳',
      fill: total > 0 ? Math.round((remaining / total) * 100) : 0,
      color: '#F4A100',
    },
    {
      label: 'Completion Rate',
      value: `${percent}%`,
      icon: '🎯',
      fill: percent,
      color: colors.accent,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.heading}>Stats</Text>
      <Text style={styles.subtext}>Your routines progress summary.</Text>

      {/* Summary pill */}
      <View style={[styles.summaryPill, { backgroundColor: colors.accentTint, borderColor: colors.accent }]}>
        <Text style={[styles.summaryText, { color: colors.accent }]}>
          {percent === 100
            ? '🎉 All done! Great work today.'
            : percent >= 50
            ? `💪 Halfway there — ${remaining} left to go!`
            : `🚀 Keep going — ${done} of ${total} done`}
        </Text>
      </View>

      {statCards.map((s) => (
        <View key={s.label} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardIcon}>{s.icon}</Text>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </View>
            <Text style={[styles.cardValue, { color: s.color }]}>{s.value}</Text>
          </View>

          {/* Progress bar */}
          <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.barFill,
                { width: `${s.fill}%`, backgroundColor: s.color },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 56,
      paddingHorizontal: 18,
    },
    heading: { fontSize: 30, fontWeight: '900', color: colors.textPrimary },
    subtext: {
      marginTop: 4,
      marginBottom: 14,
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '700',
    },

    summaryPill: {
      borderWidth: 1,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    summaryText: { fontWeight: '800', fontSize: 14 },

    card: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardIcon: { fontSize: 18 },
    cardLabel: { fontWeight: '800', fontSize: 14 },
    cardValue: { fontSize: 28, fontWeight: '900' },

    barTrack: {
      height: 7,
      borderRadius: 4,
      overflow: 'hidden',
    },
    barFill: {
      height: '100%',
      borderRadius: 4,
      minWidth: 4,
    },
  });
}