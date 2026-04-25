import { StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/theme";

export default function HomeScreen({ user, routines = [] }) {
  const total = routines.length;
  const done = routines.filter((r) => r.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Good day, {user?.username} 👋</Text>
      <Text style={styles.subtext}>Let’s keep your routines on track.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        <Text style={styles.big}>
          {total === 0 ? "0%" : `${Math.round((done / total) * 100)}%`}
        </Text>
        <Text style={styles.meta}>
          {done} completed • {Math.max(total - done, 0)} remaining
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56, paddingHorizontal: 18 },
  heading: { fontSize: 24, fontWeight: "900", color: colors.textPrimary },
  subtext: { marginTop: 6, color: colors.textSecondary, fontWeight: "700" },

  card: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontWeight: "900", color: colors.textPrimary },
  big: { marginTop: 10, fontSize: 42, fontWeight: "900", color: colors.accent },
  meta: { marginTop: 6, color: colors.textSecondary, fontWeight: "700" },
});