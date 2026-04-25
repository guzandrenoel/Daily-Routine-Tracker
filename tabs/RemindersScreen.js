import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

export default function RemindersScreen({ routines }) {
  const total = routines.length;
  const done = routines.filter((r) => r.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stats</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total routines</Text>
        <Text style={styles.value}>{total}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completed</Text>
        <Text style={styles.value}>{done}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Completion rate</Text>
        <Text style={styles.value}>{total === 0 ? '0%' : `${Math.round((done / total) * 100)}%`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 18 },
  heading: { fontSize: 28, fontWeight: '900', color: colors.textPrimary, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  label: { color: colors.textSecondary, fontWeight: '800' },
  value: { marginTop: 6, fontSize: 26, fontWeight: '900', color: colors.accent },
});